import { type ISpaceMemberService, injectSpaceMemberService } from "@undb/authz"
import { type IContext, injectContext } from "@undb/context"
import { setContextValue } from "@undb/context/server"
import { singleton } from "@undb/di"
import { createLogger } from "@undb/logger"
import { type IQueryBuilder, type ITxContext, injectQueryBuilder, injectTxCTX } from "@undb/persistence/server"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { Google, generateCodeVerifier } from "arctic"
import { env } from "bun"
import { Elysia } from "elysia"
import { type Lucia, generateIdFromEntropySize } from "lucia"
import { OAuth2RequestError, generateState } from "oslo/oauth2"
import { injectLucia } from "../auth.provider"
import { injectGoogleProvider } from "./google.provider"

@singleton()
export class GoogleOAuth {
  constructor(
    @injectSpaceMemberService()
    private spaceMemberService: ISpaceMemberService,
    @injectQueryBuilder()
    private readonly queryBuilder: IQueryBuilder,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectGoogleProvider()
    private readonly google: Google,
    @injectLucia()
    private readonly lucia: Lucia,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @injectContext()
    private readonly context: IContext,
  ) {}

  private logger = createLogger(GoogleOAuth.name)

  route() {
    return new Elysia()
      .get("/login/google", async (ctx) => {
        const state = generateState()
        const codeVerifier = generateCodeVerifier()
        const url = this.google.createAuthorizationURL(state, codeVerifier, ["email", "profile"])

        ctx.cookie["state"].set({
          value: state,
          secure: env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 60 * 10,
          path: "/",
        })

        ctx.cookie["code_verifier"].set({
          value: codeVerifier,
          secure: env.NODE_ENV === "production",
          httpOnly: true,
          maxAge: 60 * 10,
          path: "/",
        })

        return ctx.redirect(url.toString(), 302)
      })
      .get("/login/google/callback", async (ctx) => {
        const storedState = ctx.cookie["state"]?.value ?? null
        const storedCodeVerifier = ctx.cookie["code_verifier"]?.value ?? null

        const url = new URL(ctx.request.url)
        const state = url.searchParams.get("state")
        const code = url.searchParams.get("code")

        // verify state
        if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
          return new Response(null, {
            status: 400,
          })
        }

        try {
          const tokens = await this.google.validateAuthorizationCode(code, storedCodeVerifier)
          const googleUserResponse = await fetch("https://www.googleapis.com/oauth2/v1/userinfo", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken()}`,
            },
          })
          const googleUserResult: GoogleUserResult = await googleUserResponse.json()

          const existingUser = await this.queryBuilder
            .selectFrom("undb_oauth_account")
            .selectAll()
            .where((eb) =>
              eb.and([
                eb.eb("provider_id", "=", "google"),
                eb.eb("provider_user_id", "=", googleUserResult.id.toString()),
              ]),
            )
            .executeTakeFirst()

          if (existingUser) {
            const space = (await this.spaceService.getSpace({ userId: existingUser.user_id })).expect("Space not found")

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
          const existingGoogleUser = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where("undb_user.email", "=", googleUserResult.email)
            .executeTakeFirst()

          if (existingGoogleUser) {
            const space = await this.spaceService.setSpaceContext(this.context, { userId: existingGoogleUser.id })

            await this.queryBuilder
              .insertInto("undb_oauth_account")
              .values({
                provider_id: "google",
                provider_user_id: googleUserResult.id.toString(),
                user_id: existingGoogleUser.id,
              })
              .execute()

            const spaceId = space.id.value
            const session = await this.lucia.createSession(existingGoogleUser.id, { spaceId })
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
                username: googleUserResult.name,
                avatar: googleUserResult.picture,
                email: googleUserResult.email,
                password: "",
                email_verified: true,
              })
              .execute()

            setContextValue("user", {
              userId,
              username: googleUserResult.name,
              email: googleUserResult.email,
              emailVerified: true,
              avatar: googleUserResult.picture,
            })

            await tx
              .insertInto("undb_oauth_account")
              .values({
                user_id: userId,
                provider_id: "google",
                provider_user_id: googleUserResult.id.toString(),
              })
              .execute()
            const space = await this.spaceService.createSpace({ name: googleUserResult.name })
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

interface GoogleUserResult {
  id: number
  email: string
  verified_email: boolean
  name: string
  given_name: string
  picture: string
  locale: string
}
