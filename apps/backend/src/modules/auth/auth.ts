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
import { executionContext } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { inject } from "@undb/di"
import { type IQueryBuilder, getCurrentTransaction, injectQueryBuilder, sqlite } from "@undb/persistence"
import { type ISpaceService, injectSpaceService } from "@undb/space"
import { Context, Elysia, t } from "elysia"
import type { Session, User } from "lucia"
import { Lucia, generateIdFromEntropySize } from "lucia"
import { singleton } from "tsyringe"
import { v7 } from "uuid"
import { SPACE_ID_COOKIE_NAME } from "../../constants"
import { withTransaction } from "../../db"

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
  ) {}

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
      const space = await this.spaceService.getSpace({ spaceId })

      const member = space.isSome()
        ? (await this.spaceMemberService.getSpaceMember(userId, space.unwrap().id.value)).into(null)?.toJSON()
        : undefined

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
