import { LibSQLAdapter } from "@lucia-auth/adapter-sqlite"
import {
  type IInvitationQueryRepository,
  ISpaceMemberRole,
  type ISpaceMemberService,
  injectInvitationQueryRepository,
  injectSpaceMemberService,
} from "@undb/authz"
import { AcceptInvitationCommand } from "@undb/commands"
import type { ContextMember } from "@undb/context"
import { executionContext, setContextValue } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { inject } from "@undb/di"
import { Some } from "@undb/domain"
import { env } from "@undb/env"
import { type IMailService, injectMailService } from "@undb/mail"
import { type IQueryBuilder, getCurrentTransaction, injectQueryBuilder, sqlite } from "@undb/persistence"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { GitHub } from "arctic"
import { Context, Elysia, t } from "elysia"
import type { Session, User } from "lucia"
import { Lucia, generateIdFromEntropySize } from "lucia"
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo"
import { serializeCookie } from "oslo/cookie"
import { alphabet, generateRandomString } from "oslo/crypto"
import { OAuth2RequestError, generateState } from "oslo/oauth2"
import { singleton } from "tsyringe"
import { v7 } from "uuid"
import { SPACE_ID_COOKIE_NAME } from "../../constants"
import { withTransaction } from "../../db"

export const github = new GitHub(env.GITHUB_CLIENT_ID!, env.GITHUB_CLIENT_SECRET!)

const adapter = new LibSQLAdapter(sqlite, {
  user: "undb_user",
  session: "undb_session",
})

const getUsernameFromEmail = (email: string): string => {
  return email.split("@")[0]
}

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: Bun.env.NODE_ENV === "PRODUCTION", // set `Secure` flag in HTTPS
    },
  },
  getUserAttributes: (attributes) => {
    return {
      emailVerified: attributes.email_verified,
      email: attributes.email,
      username: attributes.username,
    }
  },
})

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: {
      email: string
      email_verified: boolean
      username: string
    }
  }
}

@singleton()
export class Auth {
  constructor(
    @injectSpaceMemberService()
    private spaceMemberService: ISpaceMemberService,
    @inject(CommandBus)
    private readonly commandBus: CommandBus,
    @injectInvitationQueryRepository()
    private readonly invitationRepository: IInvitationQueryRepository,
    @injectQueryBuilder()
    private readonly queryBuilder: IQueryBuilder,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectMailService()
    private readonly mailService: IMailService,
  ) {}

  async #generateEmailVerificationCode(userId: string, email: string): Promise<string> {
    const tx = getCurrentTransaction()
    await tx.deleteFrom("undb_email_verification_code").where("user_id", "=", userId).execute()
    const code = generateRandomString(6, alphabet("0-9"))
    await tx
      .insertInto("undb_email_verification_code")
      .values({
        user_id: userId,
        email,
        code,
        expires_at: createDate(new TimeSpan(15, "m")),
      })
      .execute()
    return code
  }

  async #verifyVerificationCode(user: User, code: string): Promise<boolean> {
    return this.queryBuilder.transaction().execute(async (tx) => {
      const databaseCode = await tx
        .selectFrom("undb_email_verification_code")
        .selectAll()
        .where("user_id", "=", user.id)
        .executeTakeFirst()
      if (!databaseCode || databaseCode.code !== code) {
        return false
      }
      await tx.deleteFrom("undb_email_verification_code").where("id", "=", databaseCode.id).execute()

      if (!isWithinExpirationDate(new Date(databaseCode.expires_at))) {
        return false
      }
      if (databaseCode.email !== user.email) {
        return false
      }
      return true
    })
  }

  store() {
    return async (
      context: Context,
    ): Promise<{
      user: User | null
      session: Session | null
      member: ContextMember | null
    }> => {
      // use headers instead of Cookie API to prevent type coercion
      const cookieHeader = context.request.headers.get("Cookie") ?? ""
      const sessionId = lucia.readSessionCookie(cookieHeader)

      if (!sessionId) {
        return {
          user: null,
          session: null,
          member: null,
        }
      }

      const { session, user } = await lucia.validateSession(sessionId)
      if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id)
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        })
      }
      if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        })
      }

      const userId = user?.id!
      // TODO: move to other file
      const spaceId = context.cookie[SPACE_ID_COOKIE_NAME]?.value
      const space = await this.spaceService.setSpaceContext(setContextValue, { spaceId })

      const member = space
        ? (await this.spaceMemberService.setSpaceMemberContext(setContextValue, space.id.value, userId))
            .into(null)
            ?.toJSON()
        : undefined

      setContextValue("user", {
        userId,
        username: user!.username,
        email: user!.email,
        emailVerified: user!.emailVerified,
      })
      return {
        user,
        session,
        member: member ? { role: member.role, spaceId: member.spaceId } : null,
      }
    }
  }

  route() {
    return new Elysia()
      .get("/api/me", (ctx) => {
        const store = executionContext.getStore()
        const user = store?.user
        if (!user?.userId) {
          return ctx.redirect("/login")
        }

        if (env.UNDB_VERIFY_EMAIL && !user.emailVerified && user.email) {
          return ctx.redirect(`/verify-email`, 301)
        }

        const member = store?.member

        return { user, member }
      })
      .post(
        "/api/signup",
        async (ctx) => {
          let { email, password, invitationId, username } = ctx.body
          const hasUser = !!(await this.queryBuilder.selectFrom("undb_user").selectAll().executeTakeFirst())
          let role: ISpaceMemberRole = "owner"
          if (invitationId) {
            const invitation = await this.invitationRepository.findOneById(invitationId)
            if (invitation.isNone()) {
              throw new Error("Invitation not found")
            }

            if (invitation.unwrap().email !== email) {
              throw new Error("Invalid email")
            }

            role = invitation.unwrap().role
          } else {
            role = !hasUser ? "owner" : "admin"
          }

          let userId: string

          const user = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where((eb) => eb.eb("email", "=", email))
            .executeTakeFirst()

          const response = new Response()

          if (user) {
            const validPassword = await Bun.password.verify(password, user.password)
            if (!validPassword) {
              return new Response("Invalid email or password", {
                status: 400,
              })
            }

            userId = user.id
          } else {
            userId = generateIdFromEntropySize(10) // 16 characters long
            const passwordHash = await Bun.password.hash(password)
            username = username ?? getUsernameFromEmail(email)

            executionContext.enterWith({
              requestId: ctx.headers["x-request-id"] ?? ctx.headers["X-Request-Id"] ?? v7(),
              user: {
                userId,
                username,
                email,
              },
            })

            await withTransaction(
              this.queryBuilder,
              "read uncommitted",
            )(async () => {
              await getCurrentTransaction()
                .insertInto("undb_user")
                .values({
                  email,
                  username: username!,
                  id: userId,
                  password: passwordHash,
                })
                .execute()

              const space = await this.spaceService.createPersonalSpace()
              await this.spaceMemberService.createMember(userId, space.id.value, "owner")
              ctx.cookie[SPACE_ID_COOKIE_NAME].set({ value: space.id.value })

              if (env.UNDB_VERIFY_EMAIL) {
                const verificationCode = await this.#generateEmailVerificationCode(userId, email)
                await this.mailService.send({
                  template: "verify-email",
                  data: {
                    username: username!,
                    code: verificationCode,
                    action_url: new URL(`/api/email-verification`, env.UNDB_BASE_URL).toString(),
                  },
                  subject: "Verify your email - undb",
                  to: email,
                })
              }
            })
          }

          const session = await lucia.createSession(userId, {})
          const sessionCookie = lucia.createSessionCookie(session.id)

          response.headers.set("Set-Cookie", sessionCookie.serialize())
          return response
        },
        {
          type: "json",
          body: t.Object({
            email: t.String({ format: "email" }),
            password: t.String(),
            username: t.Optional(t.String()),
            invitationId: t.Nullable(t.Optional(t.String())),
          }),
        },
      )
      .post(
        "/api/login",
        async (ctx) => {
          const email = ctx.body.email
          const password = ctx.body.password

          const user = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where("email", "=", email)
            .executeTakeFirst()

          if (!user) {
            return new Response("No user with this email", {
              status: 400,
            })
          }

          const validPassword = await Bun.password.verify(password, user.password)
          if (!validPassword) {
            return new Response("Invalid email or password", {
              status: 400,
            })
          }

          const session = await lucia.createSession(user.id, {})
          const sessionCookie = lucia.createSessionCookie(session.id)

          const spaceId = ctx.cookie[SPACE_ID_COOKIE_NAME]?.value
          let space = await this.spaceService.getSpace({ spaceId })
          if (space.isNone()) {
            space = await this.spaceService.getSpace({ userId: user.id })
            if (space.isSome()) {
              ctx.cookie[SPACE_ID_COOKIE_NAME].set({ value: space.unwrap().id.value })
            } else {
              space = Some(await this.spaceService.createPersonalSpace())
              await this.spaceMemberService.createMember(user.id, space.unwrap().id.value, "owner")
              ctx.cookie[SPACE_ID_COOKIE_NAME].set({ value: space.unwrap().id.value })
            }
          }

          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        },
        {
          type: "json",
          body: t.Object({
            email: t.String({ format: "email", default: "" }),
            password: t.String(),
          }),
        },
      )
      .post("/api/logout", (ctx) => {
        const sessionCookie = lucia.createBlankSessionCookie()
        const response = new Response()
        response.headers.set("Set-Cookie", sessionCookie.serialize())
        return response
      })
      .post(
        "/api/email-verification",
        async (ctx) => {
          const cookieHeader = ctx.request.headers.get("Cookie") ?? ""
          const sessionId = lucia.readSessionCookie(cookieHeader)

          if (!sessionId) {
            return new Response(null, {
              status: 400,
            })
          }

          const { user } = await lucia.validateSession(sessionId)
          if (!user) {
            return new Response(null, {
              status: 401,
            })
          }

          const code = ctx.body.code
          if (typeof code !== "string") {
            return new Response(null, {
              status: 400,
            })
          }

          await withTransaction(this.queryBuilder)(async () => {
            const validCode = await this.#verifyVerificationCode(user, code)
            if (!validCode) {
              throw new Error("Invalid code")
            }

            await lucia.invalidateUserSessions(user.id)
            await this.queryBuilder
              .updateTable("undb_user")
              .set("email_verified", true)
              .where("id", "=", user.id)
              .execute()
          })

          const session = await lucia.createSession(user.id, {})
          const sessionCookie = lucia.createSessionCookie(session.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        },
        {
          type: "json",
          body: t.Object({
            code: t.String(),
          }),
        },
      )
      .get("/login/github", async (ctx) => {
        const state = generateState()
        const url = await github.createAuthorizationURL(state, { scopes: ["user:email"] })
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
          const tokens = await github.validateAuthorizationCode(code)
          const githubUserResponse = await fetch("https://api.github.com/user", {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
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
            const session = await lucia.createSession(existingUser.user_id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)
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
            const spaceId = ctx.cookie[SPACE_ID_COOKIE_NAME].value
            if (!spaceId) {
              await this.spaceService.setSpaceContext(setContextValue, { userId: existingGithubUser.id })
            }

            await this.queryBuilder
              .insertInto("undb_oauth_account")
              .values({
                provider_id: "github",
                provider_user_id: githubUserResult.id.toString(),
                user_id: existingGithubUser.id,
              })
              .execute()

            const session = await lucia.createSession(existingGithubUser.id, {})
            const sessionCookie = lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          }
          const userId = generateIdFromEntropySize(10) // 16 characters long
          await withTransaction(this.queryBuilder)(async () => {
            const tx = getCurrentTransaction()
            await tx
              .insertInto("undb_user")
              .values({
                id: userId,
                username: githubUserResult.login,
                email: "",
                password: "",
                email_verified: false,
              })
              .execute()

            setContextValue("user", {
              userId,
              username: githubUserResult.login,
              email: "",
              emailVerified: false,
            })

            await tx
              .insertInto("undb_oauth_account")
              .values({
                user_id: userId,
                provider_id: "github",
                provider_user_id: githubUserResult.id.toString(),
              })
              .execute()
            const space = await this.spaceService.createPersonalSpace()
            await this.spaceMemberService.createMember(userId, space.id.value, "owner")
            ctx.cookie[SPACE_ID_COOKIE_NAME].set({ value: space.id.value })
          })
          const session = await lucia.createSession(userId, {})
          const sessionCookie = lucia.createSessionCookie(session.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        } catch (e) {
          console.log(e)
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
      .get(
        "/invitation/:invitationId/accept",
        async (ctx) => {
          return withTransaction(this.queryBuilder)(async () => {
            const { invitationId } = ctx.params
            await this.commandBus.execute(new AcceptInvitationCommand({ id: invitationId }))

            const response = ctx.redirect("/signup?invitationId=" + invitationId)
            return response
          })
        },
        {
          params: t.Object({
            invitationId: t.String(),
          }),
        },
      )
  }
}
interface GitHubUserResult {
  id: number
  login: string // username
}

interface GithubEmail {
  email: string
  primary: boolean
  verified: boolean
}
