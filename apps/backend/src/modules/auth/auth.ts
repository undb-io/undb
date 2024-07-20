import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle"
import {
  type IInvitationQueryRepository,
  IWorkspaceMemberRole,
  type IWorkspaceMemberService,
  injectInvitationQueryRepository,
  injectWorkspaceMemberService,
} from "@undb/authz"
import { AcceptInvitationCommand } from "@undb/commands"
import type { ContextMember } from "@undb/context"
import { executionContext } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { inject } from "@undb/di"
import { type IQueryBuilder, db, injectQueryBuilder, sessionTable, startTransaction, users } from "@undb/persistence"
import { SignUp } from "@undb/ui"
import { eq } from "drizzle-orm"
import { Context, Elysia, t } from "elysia"
import type { Session, User } from "lucia"
import { Lucia, generateIdFromEntropySize } from "lucia"
import { singleton } from "tsyringe"

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, users)

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
    @injectWorkspaceMemberService()
    private workspaceMemberService: IWorkspaceMemberService,
    @inject(CommandBus)
    private readonly commandBus: CommandBus,
    @injectInvitationQueryRepository()
    private readonly invitationRepository: IInvitationQueryRepository,
    @injectQueryBuilder()
    private readonly queryBuilder: IQueryBuilder,
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
      const member = (await this.workspaceMemberService.getWorkspaceMember(userId, userId)).into(null)?.toJSON()

      return {
        user,
        session,
        member: member ? { role: member.role } : null,
      }
    }
  }

  route() {
    return (
      new Elysia()
        .get("/api/me", (ctx) => {
          const store = executionContext.getStore()
          const user = store?.user
          if (!user?.userId) {
            return ctx.redirect("/signup")
          }

          const member = store?.member

          return { user, member }
        })
        .get(
          "/signup",
          async (ctx) => {
            const { invitationId } = ctx.query
            if (invitationId) {
              const invitation = await this.invitationRepository.findOneById(invitationId)
              if (!invitation.isSome()) {
                // TODO: error page
                throw new Error("Invitation not found")
              }

              return SignUp({
                email: invitation.unwrap().email,
                invitationId,
              })
            }
            return SignUp()
          },
          {
            query: t.Object({
              invitationId: t.Optional(t.String()),
            }),
          },
        )
        .post(
          "/signup",
          async (ctx) => {
            const { email, password, invitationId } = ctx.body
            const count = (await db.select().from(users).limit(1)).length
            let role: IWorkspaceMemberRole = "owner"
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
              role = count === 0 ? "owner" : "admin"
            }

            let userId: string

            const user = (await db.select().from(users).where(eq(users.email, email)).limit(1)).at(0)
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
              const username = getUsernameFromEmail(email)
              await db.insert(users).values({
                email,
                username,
                id: userId,
                password: passwordHash,
              })

              await this.workspaceMemberService.createMember(userId, userId, role)
            }

            const session = await lucia.createSession(userId, {})
            const sessionCookie = lucia.createSessionCookie(session.id)

            const response = new Response()
            response.headers.set("Set-Cookie", sessionCookie.serialize())
            response.headers.set("HX-Redirect", "/")
            return response
          },
          {
            body: t.Object({
              email: t.String({ format: "email" }),
              password: t.String(),
              invitationId: t.Optional(t.String()),
            }),
          },
        )
        // .get("/login", () => <Login />)
        .post(
          "/login",
          async (ctx) => {
            const email = ctx.body.email
            const password = ctx.body.password

            const user = (await db.select().from(users).where(eq(users.email, email)).limit(1)).at(0)

            if (!user) {
              return new Response("Invalid email or password", {
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
            body: t.Object({
              email: t.String({ format: "email" }),
              password: t.String(),
            }),
          },
        )
        .get(
          "/invitation/:invitationId/accept",
          async (ctx) => {
            return new Promise(async (resolve) => {
              return this.queryBuilder.transaction().execute(async (trx) => {
                startTransaction(trx)
                const { invitationId } = ctx.params
                await this.commandBus.execute(new AcceptInvitationCommand({ id: invitationId }))

                const response = ctx.redirect("/signup?invitationId=" + invitationId)
                resolve(response)
              })
            })
          },
          {
            params: t.Object({
              invitationId: t.String(),
            }),
          },
        )
    )
  }
}
