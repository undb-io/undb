import { singleton } from "@undb/di"
import Elysia, { t } from "elysia"
import { SPACE_ID_COOKIE_NAME } from "../../constants"

@singleton()
export class SpaceModule {
  public route() {
    return new Elysia().get(
      "/api/spaces/:spaceId/goto",
      async (ctx) => {
        const { spaceId } = ctx.params
        ctx.cookie[SPACE_ID_COOKIE_NAME].value = spaceId

        return new Response()
      },
      {
        params: t.Object({
          spaceId: t.String(),
        }),
      },
    )
  }
}
