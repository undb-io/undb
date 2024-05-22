import Elysia, { t } from "elysia"
import { createOpenApiSpec } from "@undb/openapi"
import { inject, singleton } from "@undb/di"
import { type ITableRepository, injectTableRepository, TableIdVo } from "@undb/table"
import { type IQueryBus } from "@undb/domain"
import { QueryBus } from "@undb/cqrs"
import { GetRecordsQuery } from "@undb/queries"

@singleton()
export class OpenAPI {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,

    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  public route() {
    return new Elysia()
      .get(
        "/openapi/tables/:tableId",
        async (ctx) => {
          const tableId = ctx.params.tableId
          const table = (await this.repo.findOneById(new TableIdVo(tableId))).unwrap()

          const spec = createOpenApiSpec(table)

          return (
            <html>
              <head>
                <title>Scalar API Reference</title>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
              </head>
              <body>
                <script id="api-reference" type="application/json">
                  {JSON.stringify(spec)}
                </script>

                <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
              </body>
            </html>
          )
        },
        {
          params: t.Object({
            tableId: t.String(),
          }),
        },
      )
      .get(
        "/api/tables/:tableId/records",
        async (ctx) => this.queryBus.execute(new GetRecordsQuery({ tableId: ctx.params.tableId })),
        { params: t.Object({ tableId: t.String() }) },
      )
  }
}
