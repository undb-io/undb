import {
  CreateBaseCommand,
  CreateRecordCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableFormCommand,
  CreateTableViewCommand,
  CreateWebhookCommand,
  DeleteRecordCommand,
  DeleteViewCommand,
  DuplicateRecordCommand,
  DuplicateViewCommand,
  EnableShareCommand,
  SetTableFormCommand,
  SetTableRLSCommand,
  SetViewAggregateCommand,
  SetViewColorCommand,
  SetViewFieldsCommand,
  SetViewFilterCommand,
  SetViewOptionCommand,
  SetViewSortCommand,
  UpdateBaseCommand,
  UpdateRecordCommand,
  UpdateTableFieldCommand,
  UpdateViewCommand,
  UpdateWebhookCommand,
  createBaseCommand,
  createRecordCommand,
  createTableCommand,
  createTableFieldCommand,
  createTableFormCommand,
  createTableViewCommand,
  createWebhookCommand,
  deleteRecordCommand,
  deleteViewCommand,
  duplicateRecordCommand,
  duplicateViewCommand,
  enableShareCommand,
  setTableFormCommand,
  setTableRLSCommand,
  setViewAggregateCommand,
  setViewColorCommand,
  setViewFieldsCommand,
  setViewFilterCommand,
  setViewOptionCommand,
  setViewSortCommand,
  updateBaseCommand,
  updateRecordCommand,
  updateTableFieldCommand,
  updateViewCommand,
  updateWebhookCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { container } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
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
import { z } from "@undb/zod"
import { authz } from "./authz.middleware"
import { p, t } from "./trpc"

const commandBus = container.resolve<ICommandBus>(CommandBus)
const queryBus = container.resolve<IQueryBus>(QueryBus)

const formRouter = t.router({
  create: p
    .input(createTableFormCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFormCommand(input))),
  set: p.input(setTableFormCommand).mutation(({ input }) => commandBus.execute(new SetTableFormCommand(input))),
})

const viewRouter = t.router({
  create: p
    .input(createTableViewCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableViewCommand(input))),
  update: p.input(updateViewCommand).mutation(({ input }) => commandBus.execute(new UpdateViewCommand(input))),
  duplicate: p.input(duplicateViewCommand).mutation(({ input }) => commandBus.execute(new DuplicateViewCommand(input))),
  delete: p.input(deleteViewCommand).mutation(({ input }) => commandBus.execute(new DeleteViewCommand(input))),
  setFilter: p.input(setViewFilterCommand).mutation(({ input }) => commandBus.execute(new SetViewFilterCommand(input))),
  setOption: p.input(setViewOptionCommand).mutation(({ input }) => commandBus.execute(new SetViewOptionCommand(input))),
  setColor: p.input(setViewColorCommand).mutation(({ input }) => commandBus.execute(new SetViewColorCommand(input))),
  setSort: p.input(setViewSortCommand).mutation(({ input }) => commandBus.execute(new SetViewSortCommand(input))),
  setAggregate: p
    .input(setViewAggregateCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewAggregateCommand(input))),
  setFields: p.input(setViewFieldsCommand).mutation(({ input }) => commandBus.execute(new SetViewFieldsCommand(input))),
})

const rlsRouter = t.router({
  set: p.input(setTableRLSCommand).mutation(({ input }) => commandBus.execute(new SetTableRLSCommand(input))),
})

const fieldRouter = t.router({
  create: p
    .input(createTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFieldCommand(input))),
  update: p
    .input(updateTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateTableFieldCommand(input))),
})

const tableRouter = t.router({
  list: p
    .use(authz("table:list"))
    .input(z.void())
    .output(tableDTO.array())
    .query(() => queryBus.execute(new GetTablesQuery())),
  get: p
    .use(authz("table:read"))
    .input(getTableQuery)
    .output(tableDTO)
    .query(({ input }) => queryBus.execute(new GetTableQuery(input))),
  create: p
    .use(authz("table:create"))
    .input(createTableCommand)
    .output(z.string())
    .mutation(({ input }) => commandBus.execute(new CreateTableCommand(input))),
  field: fieldRouter,
  rls: rlsRouter,
  view: viewRouter,
  form: formRouter,
})

const recordRouter = t.router({
  list: p
    .use(authz("record:list"))
    .input(getRecordsQuery)
    .query(({ input }) => queryBus.execute(new GetRecordsQuery(input))),
  get: p
    .use(authz("record:read"))
    .input(getRecordByIdQuery)
    .query(({ input }) => queryBus.execute(new GetRecordByIdQuery(input))),
  create: p
    .use(authz("record:create"))
    .input(createRecordCommand)
    .mutation(({ input }) => commandBus.execute(new CreateRecordCommand(input))),
  update: p
    .use(authz("record:update"))
    .input(updateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateRecordCommand(input))),
  delete: p
    .use(authz("record:delete"))
    .input(deleteRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteRecordCommand(input))),
  duplicate: p
    .use(authz("record:create"))
    .input(duplicateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateRecordCommand(input))),
})

const webhookRouter = t.router({
  list: p.input(getWebhooksQuery).query(({ input }) => queryBus.execute(new GetWebhooksQuery(input))),

  create: p.input(createWebhookCommand).mutation(({ input }) => commandBus.execute(new CreateWebhookCommand(input))),
  update: p.input(updateWebhookCommand).mutation(({ input }) => commandBus.execute(new UpdateWebhookCommand(input))),
})

const baseRouter = t.router({
  create: p
    .use(authz("base:create"))
    .input(createBaseCommand)
    .mutation(({ input }) => commandBus.execute(new CreateBaseCommand(input))),
  update: p
    .use(authz("base:update"))
    .input(updateBaseCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateBaseCommand(input))),
})

const shareRouter = t.router({
  enable: p
    .use(authz("share:enable"))
    .input(enableShareCommand)
    .mutation(({ input }) => commandBus.execute(new EnableShareCommand(input))),
})

export const route = t.router({
  table: tableRouter,
  record: recordRouter,
  webhook: webhookRouter,
  base: baseRouter,
  share: shareRouter,
})

export type AppRouter = typeof route
