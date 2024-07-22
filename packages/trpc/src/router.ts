import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateBaseCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableFormCommand,
  CreateTableViewCommand,
  CreateWebhookCommand,
  DeleteInvitationCommand,
  DeleteRecordCommand,
  DeleteTableFieldCommand,
  DeleteViewCommand,
  DisableShareCommand,
  DuplicateRecordCommand,
  DuplicateTableFieldCommand,
  DuplicateViewCommand,
  EnableShareCommand,
  InviteCommand,
  SetTableFormCommand,
  SetTableRLSCommand,
  SetViewAggregateCommand,
  SetViewColorCommand,
  SetViewFieldsCommand,
  SetViewFilterCommand,
  SetViewOptionCommand,
  SetViewSortCommand,
  UpdateAccountCommand,
  UpdateBaseCommand,
  UpdateRecordCommand,
  UpdateTableCommand,
  UpdateTableFieldCommand,
  UpdateViewCommand,
  UpdateWebhookCommand,
  bulkUpdateRecordsCommand,
  bulkUpdateRecordsCommandOutput,
  bulkdeleteRecordsCommand,
  bulkduplicateRecordsCommand,
  createBaseCommand,
  createRecordCommand,
  createRecordsCommand,
  createTableCommand,
  createTableFieldCommand,
  createTableFormCommand,
  createTableViewCommand,
  createWebhookCommand,
  deleteInvitationCommand,
  deleteRecordCommand,
  deleteTableFieldCommand,
  deleteViewCommand,
  disableShareCommand,
  duplicateRecordCommand,
  duplicateTableFieldCommand,
  duplicateViewCommand,
  enableShareCommand,
  inviteCommand,
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
  updateTableCommand,
  updateTableFieldCommand,
  updateViewCommand,
  updateWebhookCommand,
  updateaccountCommand,
} from "@undb/commands"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { container } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import {
  CountRecordsQuery,
  GetAggregatesQuery,
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetTableQuery,
  GetTablesQuery,
  GetWebhooksQuery,
  countRecordsOutput,
  countRecordsQuery,
  getAggregatesQuery,
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
  duplicate: p
    .input(duplicateTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateTableFieldCommand(input))),
  delete: p
    .input(deleteTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteTableFieldCommand(input))),
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
  update: p
    .use(authz("table:update"))
    .input(updateTableCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateTableCommand(input))),
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
  count: p
    .use(authz("record:read"))
    .input(countRecordsQuery)
    .output(countRecordsOutput)
    .query(({ input }) => queryBus.execute(new CountRecordsQuery(input))),
  create: p
    .use(authz("record:create"))
    .input(createRecordCommand)
    .mutation(({ input }) => commandBus.execute(new CreateRecordCommand(input))),
  bulkCreate: p
    .use(authz("record:create"))
    .input(createRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new CreateRecordsCommand(input))),
  update: p
    .use(authz("record:update"))
    .input(updateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateRecordCommand(input))),
  bulkUpdate: p
    .use(authz("record:update"))
    .input(bulkUpdateRecordsCommand)
    .output(bulkUpdateRecordsCommandOutput)
    .mutation(({ input }) => commandBus.execute(new BulkUpdateRecordsCommand(input))),
  delete: p
    .use(authz("record:delete"))
    .input(deleteRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteRecordCommand(input))),
  bulkDelete: p
    .use(authz("record:delete"))
    .input(bulkdeleteRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new BulkDeleteRecordsCommand(input))),
  duplicate: p
    .use(authz("record:create"))
    .input(duplicateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateRecordCommand(input))),
  bulkDuplicate: p
    .use(authz("record:create"))
    .input(bulkduplicateRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new BulkDuplicateRecordsCommand(input))),
  aggregate: p
    .use(authz("record:read"))
    .input(getAggregatesQuery)
    .query(({ input }) => queryBus.execute(new GetAggregatesQuery(input))),
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
  disable: p
    .use(authz("share:disable"))
    .input(disableShareCommand)
    .mutation(({ input }) => commandBus.execute(new DisableShareCommand(input))),
})

const authzRouter = t.router({
  invite: p
    .use(authz("authz:invite"))
    .input(inviteCommand)
    .mutation(({ input }) => commandBus.execute(new InviteCommand(input))),
  deleteInvitation: p
    .use(authz("authz:deleteInvitation"))
    .input(deleteInvitationCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteInvitationCommand(input))),
})

const userRouter = t.router({
  updateAccount: p
    .input(updateaccountCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateAccountCommand(input))),
})

export const route = t.router({
  table: tableRouter,
  record: recordRouter,
  webhook: webhookRouter,
  base: baseRouter,
  share: shareRouter,
  authz: authzRouter,
  user: userRouter,
})

export type AppRouter = typeof route
