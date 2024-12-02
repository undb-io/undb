import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  SubmitFormCommand,
  TriggerRecordButtonCommand,
  UpdateRecordCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { inject, singleton } from "@undb/di"
import { Option, type ICommandBus, type IQueryBus, type PaginatedDTO } from "@undb/domain"
import type { ITxContext } from "@undb/persistence/server"
import { injectQueryBuilder, injectTxCTX, type IQueryBuilder } from "@undb/persistence/server"
import {
  GetAggregatesQuery,
  GetPivotDataQuery,
  GetReadableRecordByIdQuery,
  GetReadableRecordsQuery,
} from "@undb/queries"
import { RecordDO, type IRecordReadableValueDTO } from "@undb/table"
import Elysia, { t } from "elysia"

@singleton()
export class RecordOpenApi {
  constructor(
    @inject(QueryBus)
    private readonly queryBus: IQueryBus,

    @inject(CommandBus)
    private readonly commandBus: ICommandBus,
    @injectQueryBuilder()
    private readonly qb: IQueryBuilder,
    @injectTxCTX()
    private readonly txContext: ITxContext,
  ) {}

  public route() {
    return new Elysia().group("", (app) => {
      return app
        .get(
          "/records",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const result = (await this.queryBus.execute(
              new GetReadableRecordsQuery({ baseName, tableName, ignoreView: true }),
            )) as PaginatedDTO<IRecordReadableValueDTO>
            return {
              total: result.total,
              records: result.values,
            }
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Get records",
              description: "Get records",
            },
          },
        )
        .get(
          "/views/:viewName/records",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const viewName = decodeURIComponent(ctx.params.viewName)
            const result = (await this.queryBus.execute(
              new GetReadableRecordsQuery({ baseName, tableName, viewName }),
            )) as PaginatedDTO<IRecordReadableValueDTO>
            return {
              total: result.total,
              records: result.values,
            }
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), viewName: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Get records by view id",
              description: "Get records by view id",
            },
          },
        )
        .get(
          "/views/:viewName/data",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const viewName = decodeURIComponent(ctx.params.viewName)

            return await this.queryBus.execute(new GetPivotDataQuery({ baseName, tableName, viewName }))
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), viewName: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Get pivot view data",
              description: "Get pivot view data",
            },
          },
        )
        .get(
          "/views/:viewName/records/aggregate",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const viewName = decodeURIComponent(ctx.params.viewName)

            const result = await this.queryBus.execute(
              new GetAggregatesQuery({ baseName, tableName, viewName, isReadable: true }),
            )
            return {
              data: result,
            }
          },
          {
            params: t.Object({
              baseName: t.String(),
              tableName: t.String(),
              viewName: t.String(),
            }),
            detail: {
              tags: ["Record", "Aggregate"],
              summary: "Get record aggregate in view",
              description: "Get record aggregate in view",
            },
          },
        )
        .get(
          "/views/:viewName/records/:recordId",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const viewName = decodeURIComponent(ctx.params.viewName)
            const recordId = ctx.params.recordId
            const result = await this.queryBus.execute(
              new GetReadableRecordByIdQuery({ baseName, tableName, viewName, id: recordId }),
            )
            return {
              data: result,
            }
          },
          {
            params: t.Object({
              baseName: t.String(),
              tableName: t.String(),
              viewName: t.String(),
              recordId: t.String(),
            }),
            detail: {
              tags: ["Record"],
              summary: "Get record by id in view",
              description: "Get record by id in view",
            },
          },
        )
        .get(
          "/records/:recordId",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const recordId = ctx.params.recordId
            const result = await this.queryBus.execute(
              new GetReadableRecordByIdQuery({ baseName, tableName, id: recordId, ignoreView: true }),
            )
            return {
              data: result,
            }
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), recordId: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Get record by id",
              description: "Get record by id",
            },
          },
        )
        .post(
          "/records",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(new CreateRecordCommand({ baseName, tableName, values: ctx.body.values })),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            body: t.Object({ values: t.Record(t.String(), t.Any()) }),
            detail: {
              tags: ["Record"],
              summary: "Create record",
              description: "Create record",
            },
          },
        )
        .post(
          "/records/bulk",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(new CreateRecordsCommand({ baseName, tableName, records: ctx.body.records })),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            body: t.Object({ records: t.Array(t.Object({ id: t.Optional(t.String()), values: t.Any() })) }),
            detail: {
              tags: ["Record"],
              summary: "Create records",
              description: "Create records",
            },
          },
        )
        .patch(
          "/records/:recordId",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(
                new UpdateRecordCommand({
                  tableName,
                  baseName,
                  id: ctx.params.recordId,
                  values: ctx.body.values,
                }),
              ),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), recordId: t.String() }),
            body: t.Object({ values: t.Record(t.String(), t.Any()) }),
            detail: {
              tags: ["Record"],
              summary: "Update record by id",
              description: "Update record by id",
            },
          },
        )
        .patch(
          "/records",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(
                new BulkUpdateRecordsCommand({
                  tableName,
                  baseName,
                  filter: ctx.body.filter,
                  values: ctx.body.values,
                  isOpenapi: true,
                }),
              ),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            body: t.Object({
              filter: t.Any(),
              values: t.Record(t.String(), t.Any()),
            }),
            detail: {
              tags: ["Record"],
              summary: "Update records",
              description: "Update records",
            },
          },
        )
        .post(
          "/records/:recordId/duplicate",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(new DuplicateRecordCommand({ baseName, tableName, id: ctx.params.recordId })),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), recordId: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Duplicate record by id",
              description: "Duplicate record by id",
            },
          },
        )
        .post(
          "/records/:recordId/trigger/:field",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const recordId = ctx.params.recordId
            const field = ctx.params.field
            return this.txContext.withTransaction(async () => {
              const result = (await this.commandBus.execute(
                new TriggerRecordButtonCommand({ baseName, tableName, recordId, field }),
              )) as Option<RecordDO>
              return {
                mutated: result.isSome(),
              }
            })
          },
          {
            params: t.Object({
              baseName: t.String(),
              tableName: t.String(),
              recordId: t.String(),
              field: t.String(),
            }),
            detail: {
              tags: ["Record", "Button"],
              summary: "Trigger record button",
              description: "Trigger record button",
            },
          },
        )
        .post(
          "/records/duplicate",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(
                new BulkDuplicateRecordsCommand({
                  baseName,
                  tableName,
                  filter: ctx.body.filter,
                  isOpenapi: true,
                }),
              ),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            body: t.Object({ filter: t.Any() }),
            detail: {
              tags: ["Record"],
              summary: "Duplicate records",
              description: "Duplicate records",
            },
          },
        )
        .delete(
          "/records/:recordId",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(new DeleteRecordCommand({ baseName, tableName, id: ctx.params.recordId })),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), recordId: t.String() }),
            detail: {
              tags: ["Record"],
              summary: "Delete record by id",
              description: "Delete record by id",
            },
          },
        )
        .delete(
          "/records",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(
                new BulkDeleteRecordsCommand({
                  baseName,
                  tableName,
                  filter: ctx.body.filter,
                  isOpenapi: true,
                }),
              ),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String() }),
            body: t.Object({ filter: t.Any() }),
            detail: {
              tags: ["Record"],
              summary: "Delete records",
              description: "Delete records",
            },
          },
        )
        .post(
          "/forms/:formName/submit",
          async (ctx) => {
            const baseName = decodeURIComponent(ctx.params.baseName)
            const tableName = decodeURIComponent(ctx.params.tableName)
            const formName = decodeURIComponent(ctx.params.formName)
            return this.txContext.withTransaction(() =>
              this.commandBus.execute(
                new SubmitFormCommand({ baseName, tableName, form: formName, values: ctx.body.values }),
              ),
            )
          },
          {
            params: t.Object({ baseName: t.String(), tableName: t.String(), formName: t.String() }),
            body: t.Object({ values: t.Record(t.String(), t.Any()) }),
            detail: {
              tags: ["Record", "Form"],
              summary: "Submit form",
              description: "Submit form",
            },
          },
        )
    })
  }
}
