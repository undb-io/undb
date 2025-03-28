import {
  type IInvitationQueryRepository,
  type ISpaceMemberService,
  InvitationDTO,
  injectInvitationQueryRepository,
  injectSpaceMemberService,
} from "@undb/authz"
import { AcceptInvitationCommand } from "@undb/commands"
import type { ContextMember } from "@undb/context"
import { type IContext,injectContext } from "@undb/context"
import { executionContext,setContextValue } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { container,inject,singleton } from "@undb/di"
import { None,Option,Some } from "@undb/domain"
import { env } from "@undb/env"
import { createLogger } from "@undb/logger"
import { type IMailService,injectMailService } from "@undb/mail"
import { type IQueryBuilder,type ITxContext,injectQueryBuilder,injectTxCTX } from "@undb/persistence/server"
import { type ISpaceService,injectSpaceService } from "@undb/space"
import { Context,Elysia,t } from "elysia"
import type { Session,User } from "lucia"
import { Lucia,generateIdFromEntropySize } from "lucia"
import { TimeSpan,createDate,isWithinExpirationDate } from "oslo"
import { Cookie } from "oslo/cookie"
import { alphabet,generateRandomString,sha256 } from "oslo/crypto"
import { encodeHex } from "oslo/encoding"
import { omit } from "radash"
import { v7 } from "uuid"
import { injectLucia } from "./auth.provider"
import { OAuth } from "./oauth/oauth"
import { OtpRoute } from "./otp.route"

const getUsernameFromEmail = (email: string): string => {
  return email.split("@")[0]
}

@singleton()
export class Auth {
  private readonly logger = createLogger(Auth.name)

  constructor(
    @injectSpaceMemberService()
    private readonly spaceMemberService: ISpaceMemberService,
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
    @injectLucia()
    private readonly lucia: Lucia,
    @injectTxCTX()
    private readonly txContext: ITxContext,
    @injectContext()
    private readonly context: IContext,
    @inject(OtpRoute)
    private readonly otpRoute: OtpRoute,
  ) {}

  async #generateEmailVerificationCode(userId: string, email: string): Promise<string> {
    const tx = this.txContext.getCurrentTransaction()
    await tx.deleteFrom("undb_email_verification_code").where("user_id", "=", userId).execute()
    const code = env.UNDB_MOCK_MAIL_CODE || generateRandomString(6, alphabet("0-9"))
    await tx
      .insertInto("undb_email_verification_code")
      .values({
        user_id: userId,
        email,
        code,
        expires_at: createDate(new TimeSpan(15, "m")).getTime(),
      })
      .execute()
    return code
  }

  async #verifyVerificationCode(user: User, code: string): Promise<boolean> {
    return this.txContext
      .getCurrentTransaction()
      .transaction()
      .execute(async (tx) => {
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

  async #createPasswordResetToken(userId: string): Promise<string> {
    const db = this.txContext.getCurrentTransaction()
    await db.deleteFrom("undb_password_reset_token").where("user_id", "=", userId).execute()
    const tokenId = generateIdFromEntropySize(25) // 40 character
    const tokenHash = encodeHex(await sha256(new TextEncoder().encode(tokenId)))
    await db
      .insertInto("undb_password_reset_token")
      .values({
        token: tokenHash,
        user_id: userId,
        expires_at: createDate(new TimeSpan(2, "h")).getTime(),
      })
      .execute()
    return tokenId
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
      const sessionId = this.lucia.readSessionCookie(cookieHeader)

      if (!sessionId) {
        return {
          user: null,
          session: null,
          member: null,
        }
      }

      const { session, user } = await this.lucia.validateSession(sessionId)
      if (session && session.fresh) {
        const sessionCookie = this.lucia.createSessionCookie(session.id)
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        })
      }
      if (!session) {
        const sessionCookie = this.lucia.createBlankSessionCookie()
        context.cookie[sessionCookie.name].set({
          value: sessionCookie.value,
          ...sessionCookie.attributes,
        })
      }

      const userId = user?.id!
      const spaceId = session?.spaceId
      const space = await this.spaceService.setSpaceContext(this.context, { spaceId })

      const member = space
        ? (await this.spaceMemberService.setSpaceMemberContext(this.context, space.id.value, userId))
            .into(null)
            ?.toJSON()
        : undefined

      setContextValue("user", {
        userId,
        username: user!.username,
        email: user!.email,
        emailVerified: user!.emailVerified,
        avatar: user!.avatar,
      })

      const m = member ? { role: member.role, spaceId: member.spaceId } : null
      setContextValue("member", m)

      return {
        user,
        session,
        member: m,
      }
    }
  }

  async onStart() {
    const adminEmail = env.UNDB_ADMIN_EMAIL
    const adminPassword = env.UNDB_ADMIN_PASSWORD
    if (env.UNDB_DISABLE_REGISTRATION) {
      this.logger.info("Registration is disabled")
      if (!adminEmail || !adminPassword) {
        const message =
          "Registration is disabled but admin user is not set, please set UNDB_ADMIN_EMAIL and UNDB_ADMIN_PASSWORD environment variables"
        this.logger.fatal(message)
        throw new Error(message)
      }

      const user = await this.queryBuilder
        .selectFrom("undb_user")
        .selectAll()
        .where((eb) => eb.eb("email", "=", adminEmail))
        .executeTakeFirst()

      if (!user) {
        this.logger.info("Admin user not found, creating...")
        const userId = generateIdFromEntropySize(10) // 16 characters long
        const passwordHash = await Bun.password.hash(adminPassword)
        const username = getUsernameFromEmail(adminEmail)

        executionContext.enterWith({
          requestId: v7(),
          user: {
            userId,
            username,
            email: adminEmail,
          },
        })

        await this.txContext.withTransaction(async () => {
          await this.txContext
            .getCurrentTransaction()
            .insertInto("undb_user")
            .values({
              email: adminEmail,
              username: username!,
              id: userId,
              password: passwordHash,
              email_verified: true,
            })
            .execute()

          const space = await this.spaceService.createSpace({ name: username! })
          await this.spaceMemberService.createMember(userId, space.id.value, "owner")

          this.logger.info("Admin user created")
        })
      }
    }
  }

  route() {
    const oauth = container.resolve(OAuth)
    return new Elysia()
      .use(oauth.route())
      .group("/api/auth", (app) => this.otpRoute.route(app))
      .onAfterResponse((ctx) => {
        const requestId = executionContext.getStore()?.requestId
        this.logger.info(
          {
            method: ctx.request.method,
            params: ctx.params,
            query: ctx.query,
            path: ctx.path,
            requestId,
          },
          "openapi request",
        )
      })
      .get(
        "/api/me",
        (ctx) => {
          const store = executionContext.getStore()
          const user = store?.user
          const redirect = ctx.query.redirect
          if (!user?.userId) {
            return ctx.redirect("/login" + (redirect ? `?redirect=${redirect}` : ""))
          }

          if (env.UNDB_VERIFY_EMAIL && !user.emailVerified && user.email) {
            return ctx.redirect(`/verify-email`, 301)
          }

          const member = store?.member

          return { user: omit(user, ["emailVerified"]), member }
        },
        {
          query: t.Object({
            redirect: t.Optional(t.String()),
          }),
        },
      )
      .post(
        "/api/signup",
        async (ctx) => {
          let { email, password, invitationId, username } = ctx.body
          let invitation: Option<InvitationDTO> = None
          if (invitationId) {
            invitation = await this.invitationRepository.findOneById(invitationId)
            if (invitation.isNone()) {
              throw new Error("Invitation not found")
            }

            if (invitation.unwrap().email !== email) {
              throw new Error("Invalid email")
            }
          }

          let userId: string
          let spaceId: string = ""

          const user = await this.queryBuilder
            .selectFrom("undb_user")
            .selectAll()
            .where((eb) => eb.eb("email", "=", email))
            .executeTakeFirst()

          const response = new Response()

          if (user) {
            userId = user.id
            if (!invitationId) {
              const validPassword = await Bun.password.verify(password, user.password)
              if (!validPassword) {
                return new Response("Invalid email or password", {
                  status: 400,
                })
              }

              const space = (await this.spaceService.getSpace({ userId })).expect("User should have a space")
              spaceId = space.id.value
            } else {
              const invitationSpaceId = invitation.unwrap().spaceId
              spaceId = invitationSpaceId
              await this.spaceMemberService.createMember(user.id, invitationSpaceId, invitation.unwrap().role)
            }
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

            await this.txContext.withTransaction(async () => {
              await this.txContext
                .getCurrentTransaction()
                .insertInto("undb_user")
                .values({
                  email,
                  username: username!,
                  id: userId,
                  password: passwordHash,
                })
                .execute()

              const space = await this.spaceService.createSpace({ name: username! })
              await this.spaceMemberService.createMember(userId, space.id.value, "owner")
              if (invitation.isSome()) {
                await this.spaceMemberService.createMember(
                  userId,
                  invitation.unwrap().spaceId,
                  invitation.unwrap().role,
                )
                spaceId = invitation.unwrap().spaceId
              } else {
                spaceId = space.id.value
              }

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

          const session = await this.lucia.createSession(userId, { spaceId })
          const sessionCookie = this.lucia.createSessionCookie(session.id)

          response.headers.set("Set-Cookie", sessionCookie.serialize())
          return response
        },
        {
          beforeHandle(context) {
            const invitationId = context.body.invitationId
            if (env.UNDB_DISABLE_REGISTRATION && !invitationId) {
              return new Response(null, {
                status: 403,
              })
            }
          },
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

          let space = await this.spaceService.getSpace({ userId: user.id })
          if (space.isSome()) {
          } else {
            space = Some(await this.spaceService.createSpace({ name: user.username }))
            await this.spaceMemberService.createMember(user.id, space.unwrap().id.value, "owner")
          }
          const spaceId = space.unwrap().id.value
          const session = await this.lucia.createSession(user.id, { spaceId })
          const sessionCookie = this.lucia.createSessionCookie(session.id)

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
        const sessionCookie = this.lucia.createBlankSessionCookie()
        const response = new Response()
        response.headers.set("Set-Cookie", sessionCookie.serialize())
        return response
      })
      .post(
        "/api/lang/:lang",
        (ctx) => {
          const lang = ctx.params.lang
          const cookie = new Cookie("lang", lang, {
            path: "/",
            maxAge: 365 * 24 * 60 * 60,
          })
          return new Response(null, {
            status: 200,
            headers: {
              "Set-Cookie": cookie.serialize(),
            },
          })
        },
        {
          params: t.Object({
            lang: t.Enum({ es: "es", en: "en", ko: "ko", ja: "ja", zh: "zh" }),
          }),
        },
      )
      .post(
        "/api/reset-password",
        async (ctx) => {
          return this.txContext.withTransaction(async () => {
            const email = ctx.body.email
            const tx = this.txContext.getCurrentTransaction()
            const user = await tx.selectFrom("undb_user").selectAll().where("email", "=", email).executeTakeFirst()
            if (!user) {
              return new Response(null, {
                status: 200,
              })
            }

            const token = await this.#createPasswordResetToken(user.id)
            await this.mailService.send({
              template: "reset-password",
              data: {
                action_url: new URL(`/reset-password/${token}`, env.UNDB_BASE_URL).toString(),
              },
              subject: "Reset your password - undb",
              to: email,
            })

            return new Response(null, {
              status: 200,
            })
          })
        },
        {
          type: "json",
          body: t.Object({
            email: t.String(),
          }),
        },
      )
      .post(
        "/api/reset-password/:token",
        async (ctx) => {
          return this.txContext.withTransaction(async () => {
            const tx = this.txContext.getCurrentTransaction()

            const password = ctx.body.password
            const verificationToken = ctx.params.token
            const tokenHash = encodeHex(await sha256(new TextEncoder().encode(verificationToken)))

            const token = await tx
              .selectFrom("undb_password_reset_token")
              .selectAll()
              .where("token", "=", tokenHash)
              .executeTakeFirst()
            if (token) {
              await tx.deleteFrom("undb_password_reset_token").where("token", "=", token.token).execute()
            }

            if (!token || !isWithinExpirationDate(new Date(token.expires_at))) {
              return new Response(null, {
                status: 400,
              })
            }

            await this.lucia.invalidateUserSessions(token.user_id)
            const passwordHash = await Bun.password.hash(password)
            await tx.updateTable("undb_user").where("id", "=", token.user_id).set("password", passwordHash).execute()

            const space = (await this.spaceService.getSpace({ userId: token.user_id })).expect(
              "User should have a space",
            )

            const spaceId = space.id.value
            const session = await this.lucia.createSession(token.user_id, { spaceId })
            const sessionCookie = this.lucia.createSessionCookie(session.id)
            return new Response(null, {
              status: 302,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
                "Referrer-Policy": "strict-origin",
              },
            })
          })
        },
        {
          type: "json",
          params: t.Object({
            token: t.String(),
          }),
          body: t.Object({
            password: t.String(),
          }),
        },
      )
      .post(
        "/api/email-verification",
        async (ctx) => {
          const cookieHeader = ctx.request.headers.get("Cookie") ?? ""
          const sessionId = this.lucia.readSessionCookie(cookieHeader)

          if (!sessionId) {
            return new Response(null, {
              status: 400,
            })
          }

          const { user, session: validatedSession } = await this.lucia.validateSession(sessionId)
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

          const validCode = await this.#verifyVerificationCode(user, code)
          if (!validCode) {
            throw new Error("Invalid code")
          }

          await this.lucia.invalidateUserSessions(user.id)
          await this.txContext
            .getCurrentTransaction()
            .updateTable("undb_user")
            .set("email_verified", true)
            .where("id", "=", user.id)
            .execute()

          const spaceId = validatedSession.spaceId
          const session = await this.lucia.createSession(user.id, { spaceId })
          const sessionCookie = this.lucia.createSessionCookie(session.id)
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
      .get(
        "/invitation/:invitationId/accept",
        async (ctx) => {
            const { invitationId } = ctx.params
            await this.commandBus.execute(new AcceptInvitationCommand({ id: invitationId }))

            const invitation = (await this.invitationRepository.findOneById(invitationId)).expect(
              "Invitation should exist",
            )

            const { spaceId, email, role } = invitation

            function redirectToSignupOrLogin(
              path: "signup" | "login" = "signup",
              email: string | undefined = invitation.email,
              cookie?: Cookie,
            ) {
              const search = new URLSearchParams()
              search.set("invitationId", invitationId)
              if (email) {
                search.set("email", email)
              }

              const response = ctx.redirect(`/${path}?${search.toString()}`, 301)
              if (cookie) {
                response.headers.set("Set-Cookie", cookie.serialize())
              }
              return response
            }

            const user = await this.queryBuilder
              .selectFrom("undb_user")
              .selectAll()
              .where("email", "=", email)
              .executeTakeFirst()
            if (!user) {
              return redirectToSignupOrLogin("signup", email)
            } else {
              await this.spaceMemberService.createMember(user.id, spaceId, role)
              const session = await this.lucia.createSession(user.id, { spaceId })
              const sessionCookie = this.lucia.createSessionCookie(session.id)
              return redirectToSignupOrLogin("login", email, sessionCookie)
            }
        },
        {
          params: t.Object({
            invitationId: t.String(),
          }),
        },
      )
  }
}
