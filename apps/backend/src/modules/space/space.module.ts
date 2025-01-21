import { checkPermission } from "@undb/authz"
import { DeleteSpaceCommand } from "@undb/commands"
import { type IContext, injectContext } from "@undb/context"
import { getCurrentMember } from "@undb/context/server"
import { CommandBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import type { ITxContext } from "@undb/persistence/server"
import { injectTxCTX } from "@undb/persistence/server"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import Elysia, { t } from "elysia"
import { type Lucia } from "lucia"
import { injectLucia } from "../auth/auth.provider"

@singleton()
export class SpaceModule {
  constructor(
    @injectLucia()
    private readonly lucia: Lucia,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @inject(CommandBus)
    private readonly commandBus: CommandBus,
    @injectContext()
    private readonly context: IContext,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}
  public route() {
    return new Elysia()
      .get(
        "/api/spaces/:spaceId/goto",
        async (ctx) => {
          const { spaceId } = ctx.params
          const space = (await this.spaceService.getSpace({ spaceId })).expect("Space not found")

          const cookieHeader = ctx.request.headers.get("Cookie") ?? ""
          const sessionId = this.lucia.readSessionCookie(cookieHeader)

          if (!sessionId) {
            return new Response("Unauthorized", { status: 401 })
          }

          const { session, user } = await this.lucia.validateSession(sessionId)
          if (!user) {
            return new Response(null, {
              status: 401,
            })
          }
          await this.lucia.invalidateUserSessions(user.id)
          const sid = space.id.value
          const updatedSession = await this.lucia.createSession(user.id, { spaceId: sid })
          const sessionCookie = this.lucia.createSessionCookie(updatedSession.id)
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/",
              "Set-Cookie": sessionCookie.serialize(),
            },
          })
        },
        {
          params: t.Object({
            spaceId: t.String(),
          }),
        },
      )
      .delete(
        "/api/space",
        async (ctx) => {
          return this.txContext.withTransaction(async () => {
            await this.commandBus.execute(new DeleteSpaceCommand({}))

            const userId = this.context.mustGetCurrentUserId()

            await this.lucia.invalidateSession(userId)
            const space = (await this.spaceService.getSpace({ userId })).expect("Space not found")

            const sid = space.id.value
            const updatedSession = await this.lucia.createSession(userId, { spaceId: sid })
            const sessionCookie = this.lucia.createSessionCookie(updatedSession.id)
            return new Response(null, {
              status: 200,
              headers: {
                Location: "/",
                "Set-Cookie": sessionCookie.serialize(),
              },
            })
          })
        },
        {
          beforeHandle(context) {
            const role = getCurrentMember().role
            checkPermission(role, ["space:delete"])
          },
        },
      )
  }
}
