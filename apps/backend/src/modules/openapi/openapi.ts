import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { type IBaseRepository, injectBaseRepository } from "@undb/base"
import { type IContext, injectContext } from "@undb/context"
import { executionContext } from "@undb/context/server"
import { container, inject, singleton } from "@undb/di"
import { Some } from "@undb/domain"
import { createLogger } from "@undb/logger"
import {
  API_TOKEN_HEADER_NAME,
  createOpenApiSpec,
  type IApiTokenService,
  injectApiTokenService,
  ViewsOpenApi,
} from "@undb/openapi"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import {
  injectRecordsQueryService,
  injectTableRepository,
  type IRecordsQueryService,
  type ITableRepository,
  withUniqueTable,
} from "@undb/table"
import { injectUserService, type IUserService } from "@undb/user"
import Elysia, { t } from "elysia"
import { OtpRoute } from "../auth/otp.route"
import { AuthOpenAPI } from "./auth/auth.openapi"
import { RecordOpenApi } from "./record.openapi"

@singleton()
export class OpenAPI {
  private readonly logger = createLogger(OpenAPI.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepo: IBaseRepository,
    @injectTableRepository()
    private readonly repo: ITableRepository,
    @injectRecordsQueryService()
    private readonly recordsQueryService: IRecordsQueryService,
    @injectApiTokenService()
    private readonly apiTokenService: IApiTokenService,
    @injectUserService()
    private readonly userService: IUserService,
    @injectSpaceMemberService()
    private spaceMemberService: ISpaceMemberService,
    @injectSpaceService()
    private spaceService: ISpaceService,
    @injectContext()
    private readonly context: IContext,
    @inject(AuthOpenAPI)
    private readonly authOpenAPI: AuthOpenAPI,
    @inject(OtpRoute)
    private readonly otpRoute: OtpRoute,
  ) {}

  async getSpec(baseName: string, tableName: string) {
    const ts = withUniqueTable({ baseName, tableName }).unwrap()
    const table = (await this.repo.findOne(Some(ts))).expect("Table not found")
    const base = (await this.baseRepo.findOneById(table.baseId)).expect("Base not found")
    const record = (
      await this.recordsQueryService.getReadableRecords({
        tableId: table.id.value,
        pagination: { limit: 1 },
        ignoreView: true,
      })
    ).values.at(0)

    const viewsOpenApi: ViewsOpenApi[] = []
    const views = table.views.views

    for (const view of views) {
      const viewRecord = (
        await this.recordsQueryService.getReadableRecords({
          tableId: table.id.value,
          pagination: { limit: 1 },
          viewId: view.id.value,
        })
      ).values.at(0)
      viewsOpenApi.push({ view, record: viewRecord })
    }

    const spec = createOpenApiSpec(base, table, record, viewsOpenApi)
    return spec
  }

  public route() {
    const recordOpenapi = container.resolve(RecordOpenApi)
    return new Elysia()
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
        "/api/bases/:baseName/tables/:tableName",
        async (ctx) => {
          const baseName = decodeURIComponent(ctx.params.baseName)
          const tableName = decodeURIComponent(ctx.params.tableName)
          const spec = await this.getSpec(baseName, tableName)

          return `<html>
              <head>
                <title>Scalar API Reference</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </head>
              <body>
                <script id="api-reference" type="application/json">
                  ${JSON.stringify(spec)}
                </script>
                <script>
                  var configuration = {
                    theme: 'default',
                    layout: 'classic',
                  }

                  document.getElementById('api-reference').dataset.configuration =
                    JSON.stringify(configuration)
                </script>

                <script src="/assets/api-reference@1.25.30.js"></script>
              </body>
            </html>`
        },
        {
          params: t.Object({ baseName: t.String(), tableName: t.String() }),
          detail: {
            tags: ["Doc"],
            summary: "Get OpenAPI documentation for a table",
            description: "Get OpenAPI documentation for a table",
          },
        },
      )
      .group("/openapi/auth", (app) => app.use(this.authOpenAPI.route(app)).use(this.otpRoute.route(app)))
      .group("/openapi/bases/:baseName/tables/:tableName", (app) =>
        app
          .guard({
            beforeHandle: async (context) => {
              const apiToken =
                context.headers[API_TOKEN_HEADER_NAME] ?? context.headers[API_TOKEN_HEADER_NAME.toLowerCase()]

              this.logger.debug({ apiToken }, "Checking Authorization token in openapi")

              if (apiToken) {
                const userId = await this.apiTokenService.verify(apiToken)
                if (userId.isSome()) {
                  const user = (await this.userService.findOneById(userId.unwrap())).unwrap()
                  const space = await this.spaceService.setSpaceContext(this.context, { apiToken })
                  await this.spaceMemberService.setSpaceMemberContext(this.context, space.id.value, user.id)

                  return
                }
              } else {
                const userId = this.context.getCurrentUserId()

                if (userId) {
                  return
                } else {
                  this.logger.error("No api token found in openapi")
                }
              }

              // throw 401 openapi error
              context.set.status = 401
              throw new Error("Unauthorized")
            },
          })
          .get(
            "/openapi.json",
            async (ctx) => {
              const baseName = decodeURIComponent(ctx.params.baseName)
              const tableName = decodeURIComponent(ctx.params.tableName)
              const spec = await this.getSpec(baseName, tableName)
              return spec
            },
            {
              params: t.Object({ baseName: t.String(), tableName: t.String() }),
              detail: {
                tags: ["Doc"],
                summary: "Get OpenAPI documentation json spec for a table",
                description: "Get OpenAPI documentation json spec for a table",
              },
            },
          )
          .use(recordOpenapi.route()),
      )
  }
}
