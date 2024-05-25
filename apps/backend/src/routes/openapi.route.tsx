import Elysia, { t } from "elysia"
import { createOpenApiSpec } from "@undb/openapi"
import { inject, singleton } from "@undb/di"
import {
  type ITableRepository,
  injectTableRepository,
  TableIdVo,
  type IRecordReadableDTO,
  injectRecordRepository,
  type IRecordRepository,
} from "@undb/table"
import { None, PaginatedDTO, type IQueryBus } from "@undb/domain"
import { QueryBus } from "@undb/cqrs"
import {
  GetReadableRecordByIdQuery,
  GetReadableRecordsQuery,
  GetRecordByIdQuery,
  IGetReadableRecordByIdOutput,
  IGetRecordByIdOutput,
} from "@undb/queries"
import { createLogger } from "@undb/logger"
import { executionContext } from "@undb/context/server"
import { GetReadableRecordByIdHandler } from "@undb/query-handlers/src/handlers/get-readable-record-by-id.query-handler"

@singleton()
export class OpenAPI {
  private readonly logger = createLogger(OpenAPI.name)

  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
    @injectRecordRepository()
    private readonly recordRepo: IRecordRepository,

    @inject(QueryBus)
    private readonly queryBus: IQueryBus,
  ) {}

  public route() {
    return new Elysia()
      .onResponse((ctx) => {
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
        "/openapi/tables/:tableId",
        async (ctx) => {
          const tableId = ctx.params.tableId
          const table = (await this.repo.findOneById(new TableIdVo(tableId))).unwrap()
          const record = (await this.recordRepo.findOne(table, None)).into(undefined)

          const spec = createOpenApiSpec(table, record)

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

                <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"></script>
              </body>
            </html>`
        },
        {
          params: t.Object({
            tableId: t.String(),
          }),
        },
      )
      .get(
        "/api/tables/:tableId/records",
        async (ctx) => {
          const result = (await this.queryBus.execute(
            new GetReadableRecordsQuery({ tableId: ctx.params.tableId }),
          )) as PaginatedDTO<IRecordReadableDTO>
          return {
            total: result.total,
            records: result.values,
          }
        },
        { params: t.Object({ tableId: t.String() }) },
      )
      .get(
        "/api/tables/:tableId/records/:recordId",
        async (ctx) => {
          const result = await this.queryBus.execute(
            new GetReadableRecordByIdQuery({ tableId: ctx.params.tableId, id: ctx.params.recordId }),
          )
          return {
            data: result,
          }
        },
        { params: t.Object({ tableId: t.String(), recordId: t.String() }) },
      )
  }
}
