import Elysia, { t } from "elysia"
import { createOpenApiSpec } from "@undb/openapi"
import { singleton } from "@undb/di"
import { type ITableRepository, injectTableRepository, TableIdVo } from "@undb/table"

@singleton()
export class OpenAPI {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  public route() {
    return new Elysia().get(
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
  }
}
