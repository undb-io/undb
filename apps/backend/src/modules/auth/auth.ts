import {
  type IInvitationQueryRepository,
  type ISpaceMemberService,
  injectInvitationQueryRepository,
  injectSpaceMemberService,
} from "@undb/authz"
import { AcceptInvitationCommand } from "@undb/commands"
import type { ContextMember } from "@undb/context"
import { executionContext, setContextValue } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { container, inject, singleton } from "@undb/di"
import { Some } from "@undb/domain"
import { env } from "@undb/env"
import { type IMailService, injectMailService } from "@undb/mail"
import { type IQueryBuilder, getCurrentTransaction, injectQueryBuilder } from "@undb/persistence"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { Context, Elysia, t } from "elysia"
import type { Session, User } from "lucia"
import { Lucia, generateIdFromEntropySize } from "lucia"
import { TimeSpan, createDate, isWithinExpirationDate } from "oslo"
import { alphabet, generateRandomString } from "oslo/crypto"
import { omit } from "radash"
import { v7 } from "uuid"
import { withTransaction } from "../../db"
import { injectLucia } from "./auth.provider"
import { OAuth } from "./oauth/oauth"

const getUsernameFromEmail = (email: string): string => {
  return email.split("@")[0]
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
    @injectLucia()
    private readonly lucia: Lucia,
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
        avatar: user!.avatar,
      })
      return {
        user,
        session,
        member: member ? { role: member.role, spaceId: member.spaceId } : null,
      }
    }
  }

  route() {
    const oauth = container.resolve(OAuth)
    return new Elysia()
      .use(oauth.route())
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

        return { user: omit(user, ["emailVerified"]), member }
      })
      .post(
        "/api/signup",
        async (ctx) => {
          let { email, password, invitationId, username } = ctx.body
          if (invitationId) {
            const invitation = await this.invitationRepository.findOneById(invitationId)
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
            const validPassword = await Bun.password.verify(password, user.password)
            if (!validPassword) {
              return new Response("Invalid email or password", {
                status: 400,
              })
            }

            userId = user.id
            const space = (await this.spaceService.getSpace({ userId })).expect("User should have a space")
            spaceId = space.id.value
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

              const space = await this.spaceService.createPersonalSpace(username!)
              await this.spaceMemberService.createMember(userId, space.id.value, "owner")

              spaceId = space.id.value

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

          const session = await this.lucia.createSession(userId, { space_id: spaceId })
          const sessionCookie = this.lucia.createSessionCookie(session.id)

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

          let space = await this.spaceService.getSpace({ userId: user.id })
          if (space.isSome()) {
          } else {
            space = Some(await this.spaceService.createPersonalSpace(user.username))
            await this.spaceMemberService.createMember(user.id, space.unwrap().id.value, "owner")
          }
          const session = await this.lucia.createSession(user.id, { space_id: space.unwrap().id.value })
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

          await withTransaction(this.queryBuilder)(async () => {
            const validCode = await this.#verifyVerificationCode(user, code)
            if (!validCode) {
              throw new Error("Invalid code")
            }

            await this.lucia.invalidateUserSessions(user.id)
            await this.queryBuilder
              .updateTable("undb_user")
              .set("email_verified", true)
              .where("id", "=", user.id)
              .execute()
          })

          const session = await this.lucia.createSession(user.id, { space_id: validatedSession.spaceId })
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
