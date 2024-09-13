import {
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateApiTokenCommand,
  CreateBaseCommand,
  CreateFromTemplateCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  CreateSpaceCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableFormCommand,
  CreateTableViewCommand,
  CreateWebhookCommand,
  DeleteBaseCommand,
  DeleteFormCommand,
  DeleteInvitationCommand,
  DeleteRecordCommand,
  DeleteTableCommand,
  DeleteTableFieldCommand,
  DeleteViewCommand,
  DeleteWebhookCommand,
  DisableShareCommand,
  DuplicateBaseCommand,
  DuplicateRecordCommand,
  DuplicateTableCommand,
  DuplicateTableFieldCommand,
  DuplicateViewCommand,
  EnableShareCommand,
  InviteCommand,
  SetFieldWidthCommand,
  SetTableFormCommand,
  SetTableRLSCommand,
  SetViewAggregateCommand,
  SetViewColorCommand,
  SetViewFieldsCommand,
  SetViewFilterCommand,
  SetViewOptionCommand,
  SetViewSortCommand,
  SubmitFormCommand,
  TriggerRecordButtonCommand,
  UpdateAccountCommand,
  UpdateBaseCommand,
  UpdateRecordCommand,
  UpdateSpaceCommand,
  UpdateTableCommand,
  UpdateTableFieldCommand,
  UpdateViewCommand,
  UpdateWebhookCommand,
  bulkUpdateRecordsCommand,
  bulkUpdateRecordsCommandOutput,
  bulkdeleteRecordsCommand,
  bulkduplicateRecordsCommand,
  createApiTokenCommand,
  createBaseCommand,
  createFromTemplateCommand,
  createRecordCommand,
  createRecordsCommand,
  createSpaceCommand,
  createTableCommand,
  createTableFieldCommand,
  createTableFormCommand,
  createTableViewCommand,
  createWebhookCommand,
  deleteBaseCommand,
  deleteFormCommand,
  deleteInvitationCommand,
  deleteRecordCommand,
  deleteTableCommand,
  deleteTableFieldCommand,
  deleteViewCommand,
  deleteWebhookCommand,
  disableShareCommand,
  duplicateBaseCommand,
  duplicateRecordCommand,
  duplicateTableCommand,
  duplicateTableFieldCommand,
  duplicateViewCommand,
  enableShareCommand,
  inviteCommand,
  setFieldWidthCommand,
  setTableFormCommand,
  setTableRLSCommand,
  setViewAggregateCommand,
  setViewColorCommand,
  setViewFieldsCommand,
  setViewFilterCommand,
  setViewOptionCommand,
  setViewSortCommand,
  submitFormCommand,
  triggerRecordButtonCommand,
  updateBaseCommand,
  updateRecordCommand,
  updateSpaceCommand,
  updateTableCommand,
  updateTableFieldCommand,
  updateViewCommand,
  updateWebhookCommand,
  updateaccountCommand,
} from "@undb/commands"
import { getCurrentSpaceId } from "@undb/context/server"
import { CommandBus, QueryBus } from "@undb/cqrs"
import { container } from "@undb/di"
import type { ICommandBus, IQueryBus } from "@undb/domain"
import {
  CountRecordsQuery,
  GetAggregatesQuery,
  GetApiTokensQuery,
  GetMemberSpacesQuery,
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetShareRecordByIdQuery,
  GetShareRecordsQuery,
  GetTableQuery,
  GetTablesQuery,
  GetWebhooksQuery,
  countRecordsOutput,
  countRecordsQuery,
  getAggregatesQuery,
  getApiTokensQuery,
  getMemberSpacesQuery,
  getRecordByIdQuery,
  getRecordsQuery,
  getShareRecordByIdQuery,
  getShareRecordsQuery,
  getTableQuery,
  getWebhooksQuery,
} from "@undb/queries"
import { tableDTO } from "@undb/table"
import { z } from "@undb/zod"
import { authz } from "./authz.middleware"
import { privateProcedure, publicProcedure, t } from "./trpc"

const commandBus = container.resolve<ICommandBus>(CommandBus)
const queryBus = container.resolve<IQueryBus>(QueryBus)

const formRouter = t.router({
  create: privateProcedure
    .use(authz("form:create"))
    .input(createTableFormCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFormCommand(input))),
  set: privateProcedure
    .use(authz("form:update"))
    .input(setTableFormCommand)
    .mutation(({ input }) => commandBus.execute(new SetTableFormCommand(input))),
  delete: privateProcedure
    .use(authz("form:delete"))
    .input(deleteFormCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteFormCommand(input))),
  submit: privateProcedure
    .input(submitFormCommand)
    .mutation(({ input }) => commandBus.execute(new SubmitFormCommand(input))),
})

const viewRouter = t.router({
  create: privateProcedure
    .use(authz("view:create"))
    .input(createTableViewCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableViewCommand(input))),
  update: privateProcedure
    .use(authz("view:update"))
    .input(updateViewCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateViewCommand(input))),
  duplicate: privateProcedure
    .use(authz("view:create"))
    .input(duplicateViewCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateViewCommand(input))),
  delete: privateProcedure
    .use(authz("view:delete"))
    .input(deleteViewCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteViewCommand(input))),
  setFilter: privateProcedure
    .use(authz("view:update"))
    .input(setViewFilterCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewFilterCommand(input))),
  setOption: privateProcedure
    .use(authz("view:update"))
    .input(setViewOptionCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewOptionCommand(input))),
  setColor: privateProcedure
    .use(authz("view:update"))
    .input(setViewColorCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewColorCommand(input))),
  setSort: privateProcedure
    .use(authz("view:update"))
    .input(setViewSortCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewSortCommand(input))),
  setAggregate: privateProcedure
    .use(authz("view:update"))
    .input(setViewAggregateCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewAggregateCommand(input))),
  setFields: privateProcedure
    .use(authz("view:update"))
    .input(setViewFieldsCommand)
    .mutation(({ input }) => commandBus.execute(new SetViewFieldsCommand(input))),
  setFieldWidth: privateProcedure
    .use(authz("view:update"))
    .input(setFieldWidthCommand)
    .mutation(({ input }) => commandBus.execute(new SetFieldWidthCommand(input))),
})

const rlsRouter = t.router({
  set: privateProcedure
    .input(setTableRLSCommand)
    .mutation(({ input }) => commandBus.execute(new SetTableRLSCommand(input))),
})

const fieldRouter = t.router({
  create: privateProcedure
    .use(authz("field:create"))
    .input(createTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new CreateTableFieldCommand(input))),
  update: privateProcedure
    .use(authz("field:update"))
    .input(updateTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateTableFieldCommand(input))),
  duplicate: privateProcedure
    .use(authz("field:create"))
    .input(duplicateTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateTableFieldCommand(input))),
  delete: privateProcedure
    .use(authz("field:delete"))
    .input(deleteTableFieldCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteTableFieldCommand(input))),
})

const tableRouter = t.router({
  list: privateProcedure
    .use(authz("table:list"))
    .input(z.void())
    .output(tableDTO.array())
    .query(() => queryBus.execute(new GetTablesQuery({}))),
  get: privateProcedure
    .use(authz("table:read"))
    .input(getTableQuery)
    .output(tableDTO)
    .query(({ input }) => queryBus.execute(new GetTableQuery(input))),
  create: privateProcedure
    .use(authz("table:create"))
    .input(createTableCommand)
    .output(z.string())
    .mutation(({ input }) => commandBus.execute(new CreateTableCommand(input))),
  update: privateProcedure
    .use(authz("table:update"))
    .input(updateTableCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateTableCommand(input))),
  duplicate: privateProcedure
    .use(authz("table:create"))
    .input(duplicateTableCommand)
    .output(z.string())
    .mutation(({ input }) => commandBus.execute(new DuplicateTableCommand(input))),
  delete: privateProcedure
    .use(authz("table:delete"))
    .input(deleteTableCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteTableCommand(input))),
  field: fieldRouter,
  rls: rlsRouter,
  view: viewRouter,
  form: formRouter,
})

const recordRouter = t.router({
  list: privateProcedure
    .use(authz("record:list"))
    .input(getRecordsQuery)
    .query(({ input }) => queryBus.execute(new GetRecordsQuery(input))),
  get: privateProcedure
    .use(authz("record:read"))
    .input(getRecordByIdQuery)
    .query(({ input }) => queryBus.execute(new GetRecordByIdQuery(input))),
  count: privateProcedure
    .use(authz("record:read"))
    .input(countRecordsQuery)
    .output(countRecordsOutput)
    .query(({ input }) => queryBus.execute(new CountRecordsQuery(input))),
  create: privateProcedure
    .use(authz("record:create"))
    .input(createRecordCommand)
    .mutation(({ input }) => commandBus.execute(new CreateRecordCommand(input))),
  bulkCreate: privateProcedure
    .use(authz("record:create"))
    .input(createRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new CreateRecordsCommand(input))),
  update: privateProcedure
    .use(authz("record:update"))
    .input(updateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateRecordCommand(input))),
  bulkUpdate: privateProcedure
    .use(authz("record:update"))
    .input(bulkUpdateRecordsCommand)
    .output(bulkUpdateRecordsCommandOutput)
    .mutation(({ input }) => commandBus.execute(new BulkUpdateRecordsCommand(input))),
  delete: privateProcedure
    .use(authz("record:delete"))
    .input(deleteRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteRecordCommand(input))),
  bulkDelete: privateProcedure
    .use(authz("record:delete"))
    .input(bulkdeleteRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new BulkDeleteRecordsCommand(input))),
  duplicate: privateProcedure
    .use(authz("record:create"))
    .input(duplicateRecordCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateRecordCommand(input))),
  bulkDuplicate: privateProcedure
    .use(authz("record:create"))
    .input(bulkduplicateRecordsCommand)
    .mutation(({ input }) => commandBus.execute(new BulkDuplicateRecordsCommand(input))),
  aggregate: privateProcedure
    .use(authz("record:read"))
    .input(getAggregatesQuery)
    .query(({ input }) => queryBus.execute(new GetAggregatesQuery(input))),
  trigger: privateProcedure
    .use(authz("record:update"))
    .input(triggerRecordButtonCommand)
    .mutation(({ input }) => commandBus.execute(new TriggerRecordButtonCommand(input))),
})

const webhookRouter = t.router({
  list: privateProcedure
    .use(authz("webhook:list"))
    .input(getWebhooksQuery)
    .query(({ input }) => queryBus.execute(new GetWebhooksQuery(input))),
  create: privateProcedure
    .use(authz("webhook:create"))
    .input(createWebhookCommand)
    .mutation(({ input }) => commandBus.execute(new CreateWebhookCommand(input))),
  update: privateProcedure
    .use(authz("webhook:update"))
    .input(updateWebhookCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateWebhookCommand(input))),
  delete: privateProcedure
    .use(authz("webhook:delete"))
    .input(deleteWebhookCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteWebhookCommand(input))),
})

const baseRouter = t.router({
  create: privateProcedure
    .use(authz("base:create"))
    .input(createBaseCommand.omit({ spaceId: true }))
    .mutation(({ input }) => {
      const spaceId = getCurrentSpaceId()
      if (!spaceId) {
        throw new Error("spaceId is required")
      }
      return commandBus.execute(new CreateBaseCommand({ ...input, spaceId }))
    }),
  createFromTemplate: privateProcedure
    // check authz in handler, because we can create base to another space
    // .use(authz("base:create"))
    .input(createFromTemplateCommand)
    .mutation(({ input }) => commandBus.execute(new CreateFromTemplateCommand(input))),
  duplicate: privateProcedure
    .use(authz("base:create"))
    .input(duplicateBaseCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateBaseCommand(input))),
  update: privateProcedure
    .use(authz("base:update"))
    .input(updateBaseCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateBaseCommand(input))),
  delete: privateProcedure
    .use(authz("base:delete"))
    .input(deleteBaseCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteBaseCommand(input))),
})

const shareRouter = t.router({
  enable: privateProcedure
    .input(enableShareCommand)
    .mutation(({ input }) => commandBus.execute(new EnableShareCommand(input))),
  disable: privateProcedure
    .use(authz("share:disable"))
    .input(disableShareCommand)
    .mutation(({ input }) => commandBus.execute(new DisableShareCommand(input))),
})

const shareDataRouter = t.router({
  records: publicProcedure
    .input(getShareRecordsQuery)
    .query(({ input }) => queryBus.execute(new GetShareRecordsQuery(input))),
  record: publicProcedure
    .input(getShareRecordByIdQuery)
    .query(({ input }) => queryBus.execute(new GetShareRecordByIdQuery(input))),
})

const authzRouter = t.router({
  invite: privateProcedure
    .use(authz("authz:invite"))
    .input(inviteCommand)
    .mutation(({ input }) => commandBus.execute(new InviteCommand(input))),
  deleteInvitation: privateProcedure
    .use(authz("authz:deleteInvitation"))
    .input(deleteInvitationCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteInvitationCommand(input))),
})

const userRouter = t.router({
  updateAccount: privateProcedure
    .input(updateaccountCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateAccountCommand(input))),
})

const apiTokenRouter = t.router({
  create: privateProcedure
    .input(createApiTokenCommand)
    .mutation(({ input }) => commandBus.execute(new CreateApiTokenCommand(input))),
  list: privateProcedure.input(getApiTokensQuery).query(({ input }) => queryBus.execute(new GetApiTokensQuery(input))),
})

const spaceRouter = t.router({
  list: privateProcedure
    .input(getMemberSpacesQuery)
    .use(authz("space:list"))
    .query(({ input }) => queryBus.execute(new GetMemberSpacesQuery(input))),
  create: privateProcedure
    .input(createSpaceCommand)
    .mutation(({ input }) => commandBus.execute(new CreateSpaceCommand(input))),
  update: privateProcedure
    .input(updateSpaceCommand)
    .use(authz("space:update"))
    .mutation(({ input }) => commandBus.execute(new UpdateSpaceCommand(input))),
})

export const route = t.router({
  table: tableRouter,
  record: recordRouter,
  webhook: webhookRouter,
  base: baseRouter,
  share: shareRouter,
  authz: authzRouter,
  user: userRouter,
  space: spaceRouter,
  apiToken: apiTokenRouter,
  shareData: shareDataRouter,
})

export type AppRouter = typeof route
