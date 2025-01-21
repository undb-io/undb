import { type ISpaceMemberService, injectSpaceMemberService } from "@undb/authz"
import { type IContext, injectContext } from "@undb/context"
import { setContextValue } from "@undb/context/server"
import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { type IQueryBuilder, type ITxContext, injectQueryBuilder, injectTxCTX } from "@undb/persistence/server"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { GitHub } from "arctic"
import { Elysia } from "elysia"
import { type Lucia, generateIdFromEntropySize } from "lucia"
import { serializeCookie } from "oslo/cookie"
import { OAuth2RequestError, generateState } from "oslo/oauth2"
import { injectLucia } from "../auth.provider"
import { injectGithubProvider } from "./github.provider"

@singleton()
export class GithubOAuth {
  constructor(
    @injectSpaceMemberService()
    private spaceMemberService: ISpaceMemberService,
    @injectQueryBuilder()
    private readonly queryBuilder: IQueryBuilder,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectGithubProvider()
    private readonly github: GitHub,
    @injectLucia()
    private readonly lucia: Lucia,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @injectContext()
    private readonly context: IContext,
  ) {}

  private logger = createLogger(GithubOAuth.name)

  route() {
    return new Elysia()
      .get("/login/github", async (ctx) => {
        const state = generateState()
        const url = this.github.createAuthorizationURL(state, ["user:email"])
        return new Response(null, {
          status: 302,
          headers: {
            Location: url.toString(),
            "Set-Cookie": serializeCookie("github_oauth_state", state, {
              httpOnly: true,
              secure: Bun.env.NODE_ENV === "production",
              maxAge: 60 * 10, // 10 minutes
              path: "/",
            }),
          },
        })
      })
      .get("/login/github/callback", async (ctx) => {
        const stateCookie = ctx.cookie["github_oauth_state"]?.value ?? null

        const url = new URL(ctx.request.url)
        const state = url.searchParams.get("state")
        const code = url.searchParams.get("code")

        // verify state
        if (!state || !stateCookie || !code || stateCookie !== state) {
          return new Response(null, {
            status: 400,
          })
        }

        try {
          const tokens = await this.github.validateAuthorizationCode(code)
          const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken()}`,
            },
          })
          const githubUserResult: GitHubUserResult = await githubUserResponse.json()

          const existingUser = await this.queryBuilder
            .selectFrom("undb_oauth_account")
            .selectAll()
            .where((eb) =>
              eb.and([
                eb.eb("provider_id", "=", "github"),
                eb.eb("provider_user_id", "=", githubUserResult.id.toString()),
              ]),
            )
            .executeTakeFirst()

          if (existingUser) {
            const space = (await this.spaceService.getSpace({ userId: existingUser.user_id })).expect("space not found")
            const spaceId = space.id.value
            const session = await this.lucia.createSession(existingUser.user_id, { spaceId })
            const sessionCookie = this.lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          }

          const emailsResponse = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
            },
          })
          const emails: GithubEmail[] = await emailsResponse.json()

          const primaryEmail = emails.find((email) => email.primary) ?? null
          if (!primaryEmail) {
            return new Response("No primary email address", {
              status: 400,
            })
          }
          if (!primaryEmail.verified) {
            return new Response("Unverified email", {
              status: 400,
            })
          }

          const existingGithubUser = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where("undb_user.email", "=", primaryEmail.email)
            .executeTakeFirst()

          if (existingGithubUser) {
            const space = await this.spaceService.setSpaceContext(this.context, { userId: existingGithubUser.id })

            await this.queryBuilder
              .insertInto("undb_oauth_account")
              .values({
                provider_id: "github",
                provider_user_id: githubUserResult.id.toString(),
                user_id: existingGithubUser.id,
              })
              .execute()

            const spaceId = space.id.value
            const session = await this.lucia.createSession(existingGithubUser.id, { spaceId })
            const sessionCookie = this.lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          }
          const userId = generateIdFromEntropySize(10) // 16 characters long
          const space = await this.txContext.withTransaction(async () => {
            const tx = this.txContext.getCurrentTransaction()
            await tx
              .insertInto("undb_user")
              .values({
                id: userId,
                username: githubUserResult.login,
                email: primaryEmail.email,
                avatar: githubUserResult.avatar_url,
                password: "",
                email_verified: true,
              })
              .execute()

            setContextValue("user", {
              userId,
              username: githubUserResult.login,
              email: primaryEmail.email,
              emailVerified: true,
              avatar: githubUserResult.avatar_url,
            })

            await tx
              .insertInto("undb_oauth_account")
              .values({
                user_id: userId,
                provider_id: "github",
                provider_user_id: githubUserResult.id.toString(),
              })
              .execute()
            const space = await this.spaceService.createSpace({ name: githubUserResult.login })
            await this.spaceMemberService.createMember(userId, space.id.value, "owner")

            return space
          })

          const spaceId = space.id.value
          const session = await this.lucia.createSession(userId, { spaceId })
          const sessionCookie = this.lucia.createSessionCookie(session.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        } catch (e) {
          this.logger.error(e, "Failed to authenticate user")
          if (e instanceof OAuth2RequestError) {
            // bad verification code, invalid credentials, etc
            return new Response(null, {
              status: 400,
            })
          }
          return new Response(null, {
            status: 500,
          })
        }
      })
  }
}
interface GitHubUserResult {
  id: number
  login: string // username
  avatar_url: string
}

interface GithubEmail {
  email: string
  primary: boolean
  verified: boolean
}
