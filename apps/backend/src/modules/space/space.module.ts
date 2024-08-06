import { singleton } from "@undb/di"
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
  ) {}
  public route() {
    return new Elysia().get(
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
        const updatedSession = await this.lucia.createSession(user.id, { space_id: space.id.value })
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
  }
}
