import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  bulkduplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateRecordCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  UpdateRecordCommand,
} from "@undb/commands"
import { executionContext } from "@undb/context/server"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import { type ICommandBus, None, PaginatedDTO, type IQueryBus } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { createOpenApiSpec } from "@undb/openapi"
import { injectQueryBuilder, type IQueryBuilder } from "@undb/persistence"
import { GetReadableRecordByIdQuery, GetReadableRecordsQuery } from "@undb/queries"
import {
  TableIdVo,
  injectRecordRepository,
  injectTableRepository,
  type IRecordReadableDTO,
  type IRecordRepository,
  type ITableRepository,
} from "@undb/table"
import Elysia, { t } from "elysia"
import { withTransaction } from "../../db"

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

    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
  ) {}

  public route() {
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

                <script src="/assets/api-reference.js"></script>
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
      .post(
        "/api/tables/:tableId/records",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new CreateRecordCommand({ tableId: ctx.params.tableId, values: ctx.body.values }),
            )
          })
        },
        { params: t.Object({ tableId: t.String() }), body: t.Object({ values: t.Record(t.String(), t.Any()) }) },
      )
      .patch(
        "/api/tables/:tableId/records/:recordId",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new UpdateRecordCommand({
                tableId: ctx.params.tableId,
                id: ctx.params.recordId,
                values: ctx.body.values,
              }),
            )
          })
        },
        {
          params: t.Object({ tableId: t.String(), recordId: t.String() }),
          body: t.Object({ values: t.Record(t.String(), t.Any()) }),
        },
      )
      .patch(
        "/api/tables/:tableId/records",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new BulkUpdateRecordsCommand({
                tableId: ctx.params.tableId,
                filter: ctx.body.filter,
                values: ctx.body.values,
                isOpenapi: true,
              }),
            )
          })
        },
        {
          params: t.Object({ tableId: t.String() }),
          body: t.Object({
            filter: t.Any(),
            values: t.Record(t.String(), t.Any()),
          }),
        },
      )
      .post(
        "/api/tables/:tableId/records/:recordId/duplicate",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new DuplicateRecordCommand({ tableId: ctx.params.tableId, id: ctx.params.recordId }),
            )
          })
        },
        { params: t.Object({ tableId: t.String(), recordId: t.String() }) },
      )
      .post(
        "/api/tables/:tableId/records/duplicate",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new BulkDuplicateRecordsCommand({
                tableId: ctx.params.tableId,
                filter: ctx.body.filter,
                isOpenapi: true,
              }),
            )
          })
        },
        {
          params: t.Object({ tableId: t.String() }),
          body: t.Object({ filter: t.Any() }),
        },
      )
      .delete(
        "/api/tables/:tableId/records/:recordId",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new DeleteRecordCommand({ tableId: ctx.params.tableId, id: ctx.params.recordId }),
            )
          })
        },
        { params: t.Object({ tableId: t.String(), recordId: t.String() }) },
      )
      .delete(
        "/api/tables/:tableId/records",
        async (ctx) => {
          return withTransaction(this.qb)(() => {
            return this.commandBus.execute(
              new BulkDeleteRecordsCommand({
                tableId: ctx.params.tableId,
                filter: ctx.body.filter,
                isOpenapi: true,
              }),
            )
          })
        },
        {
          params: t.Object({ tableId: t.String() }),
          body: t.Object({ filter: t.Any() }),
        },
      )
  }
}
