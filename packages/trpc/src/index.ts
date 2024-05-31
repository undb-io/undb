import { initTRPC } from "@trpc/server"
import {
  CreateRecordCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableFormCommand,
  CreateWebhookCommand,
  DeleteRecordCommand,
  DuplicateRecordCommand,
  SetTableFormCommand,
  SetTableRLSCommand,
  SetViewAggregateCommand,
  SetViewColorCommand,
  SetViewFilterCommand,
  SetViewSortCommand,
  UpdateRecordCommand,
  UpdateWebhookCommand,
  createRecordCommand,
  createTableCommand,
  createTableFieldCommand,
  createTableFormCommand,
  createWebhookCommand,
  deleteRecordCommand,
  duplicateRecordCommand,
  setTableFormCommand,
  setTableRLSCommand,
  setViewAggregateCommand,
  setViewColorCommand,
  setViewFilterCommand,
  setViewSortCommand,
  updateRecordCommand,
  updateWebhookCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { container } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import { createLogger } from "@undb/logger"
import {
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetTableQuery,
  GetTablesQuery,
  GetWebhooksQuery,
  getRecordByIdQuery,
  getRecordsQuery,
  getTableQuery,
  getWebhooksQuery,
} from "@undb/queries"
import { tableDTO } from "@undb/table"
import { ZodError, z } from "@undb/zod"
import { fromError } from "zod-validation-error"
import pkg from "../package.json"

const log = createLogger(pkg.name)

const commandBus = container.resolve<ICommandBus>(CommandBus)
const queryBus = container.resolve<IQueryBus>(QueryBus)

const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      message: error.cause instanceof ZodError ? fromError(error.cause).toString() : error.message,
    }
  },
})

const p = t.procedure.use(async ({ type, input, path, next }) => {
  const startTime = performance.now()

  const result = await next()

  const responseTime = performance.now() - startTime

  const meta = {
    responseTime,
    type,
    input,
    path,
  }
  if (result.ok) {
    log.info(meta, `trpc.${type}: ${path}`)
  } else {
    log.error({ ...meta, error: result.error }, `trpc.error: ${result.error.message}`)
  }

  return result
})

const formRouter = t.router({
  create: p
    .input(createTableFormCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFormCommand(input))),
  set: p.input(setTableFormCommand).mutation(({ input }) => commandBus.execute(new SetTableFormCommand(input))),
})

const viewRouter = t.router({
  setFilter: p.input(setViewFilterCommand).mutation(({ input }) => commandBus.execute(new SetViewFilterCommand(input))),
  setColor: p.input(setViewColorCommand).mutation(({ input }) => commandBus.execute(new SetViewColorCommand(input))),
  setSort: p.input(setViewSortCommand).mutation(({ input }) => commandBus.execute(new SetViewSortCommand(input))),
  setAggregate: p
    .input(setViewAggregateCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewAggregateCommand(input))),
})

const rlsRouter = t.router({
  set: p.input(setTableRLSCommand).mutation(({ input }) => commandBus.execute(new SetTableRLSCommand(input))),
})

export const fieldRouter = t.router({
  create: p
    .input(createTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFieldCommand(input))),
})

const tableRouter = t.router({
  list: p
    .input(z.void())
    .output(tableDTO.array())
    .query(() => queryBus.execute(new GetTablesQuery())),
  get: p
    .input(getTableQuery)
    .output(tableDTO)
    .query(({ input }) => queryBus.execute(new GetTableQuery(input))),
  create: p
    .input(createTableCommand)
    .output(z.string())
    .mutation(({ input }) => commandBus.execute(new CreateTableCommand(input))),
  field: fieldRouter,
  rls: rlsRouter,
  view: viewRouter,
  form: formRouter,
})

export const recordRouter = t.router({
  list: p.input(getRecordsQuery).query(({ input }) => queryBus.execute(new GetRecordsQuery(input))),
  get: p.input(getRecordByIdQuery).query(({ input }) => queryBus.execute(new GetRecordByIdQuery(input))),
  create: p.input(createRecordCommand).mutation(({ input }) => commandBus.execute(new CreateRecordCommand(input))),
  update: p.input(updateRecordCommand).mutation(({ input }) => commandBus.execute(new UpdateRecordCommand(input))),
  delete: p.input(deleteRecordCommand).mutation(({ input }) => commandBus.execute(new DeleteRecordCommand(input))),
  duplicate: p
    .input(duplicateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateRecordCommand(input))),
})

const webhookRouter = t.router({
  list: p.input(getWebhooksQuery).query(({ input }) => queryBus.execute(new GetWebhooksQuery(input))),

  create: p.input(createWebhookCommand).mutation(({ input }) => commandBus.execute(new CreateWebhookCommand(input))),
  update: p.input(updateWebhookCommand).mutation(({ input }) => commandBus.execute(new UpdateWebhookCommand(input))),
})

export const route = t.router({
  table: tableRouter,
  record: recordRouter,
  webhook: webhookRouter,
})

export type AppRouter = typeof route
