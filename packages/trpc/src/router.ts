import {
  AddDashboardWidgetCommand,
  BulkDeleteRecordsCommand,
  BulkDuplicateRecordsCommand,
  BulkUpdateRecordsCommand,
  CreateApiTokenCommand,
  CreateBaseCommand,
  CreateDashboardCommand,
  CreateFromShareCommand,
  CreateFromTemplateCommand,
  CreateRecordCommand,
  CreateRecordsCommand,
  CreateSpaceCommand,
  CreateTableCommand,
  CreateTableFieldCommand,
  CreateTableFormCommand,
  CreateTableViewCommand,
  CreateViewWidgetCommand,
  CreateWebhookCommand,
  DeleteBaseCommand,
  DeleteDashboardCommand,
  DeleteDashboardWidgetCommand,
  DeleteFormCommand,
  DeleteInvitationCommand,
  DeleteRecordCommand,
  DeleteTableCommand,
  DeleteTableFieldCommand,
  DeleteViewCommand,
  DeleteViewWidgetCommand,
  DeleteWebhookCommand,
  DisableShareCommand,
  DuplicateBaseCommand,
  DuplicateDashboardCommand,
  DuplicateDashboardWidgetCommand,
  DuplicateRecordCommand,
  DuplicateTableCommand,
  DuplicateTableFieldCommand,
  DuplicateTableFormCommand,
  DuplicateViewCommand,
  DuplicateViewWidgetCommand,
  EnableShareCommand,
  InviteCommand,
  RelayoutDashboardWidgetsCommand,
  SetDefaultViewCommand,
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
  UpdateDashboardCommand,
  UpdateDashboardWidgetCommand,
  UpdateRecordCommand,
  UpdateSpaceCommand,
  UpdateTableCommand,
  UpdateTableFieldCommand,
  UpdateViewCommand,
  UpdateViewWidgetCommand,
  UpdateWebhookCommand,
  addDashboardWidgetCommand,
  bulkUpdateRecordsCommand,
  bulkUpdateRecordsCommandOutput,
  bulkdeleteRecordsCommand,
  bulkduplicateRecordsCommand,
  createApiTokenCommand,
  createBaseCommand,
  createBaseCommandOutput,
  createDashboardCommand,
  createFromShareCommand,
  createFromTemplateCommand,
  createFromTemplateCommandOutput,
  createRecordCommand,
  createRecordCommandOutput,
  createRecordsCommand,
  createSpaceCommand,
  createTableCommand,
  createTableFieldCommand,
  createTableFormCommand,
  createTableFormCommandOutput,
  createTableViewCommand,
  createTableViewCommandOutput,
  createViewWidgetCommand,
  createWebhookCommand,
  deleteBaseCommand,
  deleteDashboardCommand,
  deleteDashboardWidgetCommand,
  deleteFormCommand,
  deleteInvitationCommand,
  deleteRecordCommand,
  deleteTableCommand,
  deleteTableFieldCommand,
  deleteViewCommand,
  deleteViewWidgetCommand,
  deleteWebhookCommand,
  disableShareCommand,
  duplicateBaseCommand,
  duplicateDashboardCommand,
  duplicateDashboardWidgetCommand,
  duplicateRecordCommand,
  duplicateTableCommand,
  duplicateTableFieldCommand,
  duplicateTableFormCommand,
  duplicateTableFormCommandOutput,
  duplicateViewCommand,
  duplicateViewCommandOutput,
  duplicateViewWidgetCommand,
  enableShareCommand,
  inviteCommand,
  relayoutDashboardWidgetsCommand,
  setDefaultViewCommand,
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
  updateDashboardCommand,
  updateDashboardWidgetCommand,
  updateRecordCommand,
  updateSpaceCommand,
  updateTableCommand,
  updateTableFieldCommand,
  updateViewCommand,
  updateViewWidgetCommand,
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
  GetBaseQuery,
  GetBasesQuery,
  GetDashboardByIdQuery,
  GetDashboardsQuery,
  GetMemberSpacesQuery,
  GetPivotDataQuery,
  GetRecordByIdQuery,
  GetRecordsQuery,
  GetShareAggregatesQuery,
  GetSharePivotDataQuery,
  GetShareRecordByIdQuery,
  GetShareRecordsQuery,
  GetTableQuery,
  GetTablesQuery,
  GetTemplateQuery,
  GetTemplatesQuery,
  GetWebhooksQuery,
  countRecordsOutput,
  countRecordsQuery,
  getAggregatesQuery,
  getApiTokensQuery,
  getBaseQuery,
  getBaseQueryOutput,
  getBasesQuery,
  getBasesQueryOutput,
  getDashboardByIdQuery,
  getDashboardsQuery,
  getMemberSpacesOutput,
  getMemberSpacesQuery,
  getPivotDataQuery,
  getRecordByIdQuery,
  getRecordsQuery,
  getShareAggregatesQuery,
  getSharePivotDataQuery,
  getShareRecordByIdQuery,
  getShareRecordsQuery,
  getTableQuery,
  getTablesQuery,
  getTablesQueryOutput,
  getTemplateOutput,
  getTemplateQuery,
  getTemplatesQuery,
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
    .output(createTableFormCommandOutput)
    .mutation(({ input }) => commandBus.execute(new CreateTableFormCommand(input))),
  duplicate: privateProcedure
    .use(authz("form:create"))
    .input(duplicateTableFormCommand)
    .output(duplicateTableFormCommandOutput)
    .mutation(({ input }) => commandBus.execute(new DuplicateTableFormCommand(input))),
  set: privateProcedure
    .use(authz("form:update"))
    .input(setTableFormCommand)
    .mutation(({ input }) => commandBus.execute(new SetTableFormCommand(input))),
  delete: privateProcedure
    .use(authz("form:delete"))
    .input(deleteFormCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteFormCommand(input))),
  submit: publicProcedure
    .input(submitFormCommand)
    .mutation(({ input }) => commandBus.execute(new SubmitFormCommand(input))),
})

const viewWidgetRouter = t.router({
  create: privateProcedure
    .use(authz("view:update"))
    .input(createViewWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new CreateViewWidgetCommand(input))),
  update: privateProcedure
    .use(authz("view:update"))
    .input(updateViewWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateViewWidgetCommand(input))),
  duplicate: privateProcedure
    .use(authz("view:update"))
    .input(duplicateViewWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateViewWidgetCommand(input))),
  delete: privateProcedure
    .use(authz("view:update"))
    .input(deleteViewWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteViewWidgetCommand(input))),
})

const viewRouter = t.router({
  create: privateProcedure
    .use(authz("view:create"))
    .input(createTableViewCommand)
    .output(createTableViewCommandOutput)
    .mutation(({ input }) => commandBus.execute(new CreateTableViewCommand(input))),
  update: privateProcedure
    .use(authz("view:update"))
    .input(updateViewCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateViewCommand(input))),
  duplicate: privateProcedure
    .use(authz("view:create"))
    .input(duplicateViewCommand)
    .output(duplicateViewCommandOutput)
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
  setDefault: privateProcedure
    .use(authz("view:update"))
    .input(setDefaultViewCommand)
    .mutation(({ input }) => commandBus.execute(new SetDefaultViewCommand(input))),
  widget: viewWidgetRouter,
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
    .input(getTablesQuery)
    .output(getTablesQueryOutput)
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
  pivot: privateProcedure
    .use(authz("record:read"))
    .input(getPivotDataQuery)
    .query(({ input }) => queryBus.execute(new GetPivotDataQuery(input))),
  count: privateProcedure
    .use(authz("record:read"))
    .input(countRecordsQuery)
    .output(countRecordsOutput)
    .query(({ input }) => queryBus.execute(new CountRecordsQuery(input))),
  create: privateProcedure
    .use(authz("record:create"))
    .input(createRecordCommand)
    .output(createRecordCommandOutput)
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
  list: privateProcedure
    .use(authz("base:list"))
    .input(getBasesQuery)
    .output(getBasesQueryOutput)
    .query(({ input }) => queryBus.execute(new GetBasesQuery(input))),
  get: privateProcedure
    .use(authz("base:read"))
    .input(getBaseQuery)
    .output(getBaseQueryOutput)
    .query(({ input }) => queryBus.execute(new GetBaseQuery(input))),
  create: privateProcedure
    .use(authz("base:create"))
    .input(createBaseCommand.omit({ spaceId: true }))
    .output(createBaseCommandOutput)
    .mutation(({ input }) => {
      const spaceId = getCurrentSpaceId()
      if (!spaceId) {
        throw new Error("spaceId is required")
      }
      return commandBus.execute(new CreateBaseCommand({ ...input, spaceId }))
    }),
  createFromShare: privateProcedure
    // check authz in handler, because we can create base to another space
    // .use(authz("base:create"))
    .input(createFromShareCommand)
    .mutation(({ input }) => commandBus.execute(new CreateFromShareCommand(input))),
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
  aggregate: publicProcedure
    .input(getShareAggregatesQuery)
    .query(({ input }) => queryBus.execute(new GetShareAggregatesQuery(input))),
  pivot: publicProcedure
    .input(getSharePivotDataQuery)
    .query(({ input }) => queryBus.execute(new GetSharePivotDataQuery(input))),
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
    .use(authz("space:list"))
    .input(getMemberSpacesQuery)
    .output(getMemberSpacesOutput)
    .query(({ input }) => queryBus.execute(new GetMemberSpacesQuery(input))),
  create: privateProcedure
    .input(createSpaceCommand)
    .mutation(({ input }) => commandBus.execute(new CreateSpaceCommand(input))),
  update: privateProcedure
    .use(authz("space:update"))
    .input(updateSpaceCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateSpaceCommand(input))),
})

const templateRouter = t.router({
  list: publicProcedure.input(getTemplatesQuery).query(({ input }) => queryBus.execute(new GetTemplatesQuery())),
  get: publicProcedure
    .input(getTemplateQuery)
    .output(getTemplateOutput)
    .query(({ input }) => queryBus.execute(new GetTemplateQuery(input))),
  createFromTemplate: privateProcedure
    .use(authz("base:create"))
    .input(createFromTemplateCommand)
    .output(createFromTemplateCommandOutput)
    .mutation(({ input }) => commandBus.execute(new CreateFromTemplateCommand(input))),
})

const dashboardWidgetRouter = t.router({
  add: privateProcedure
    .use(authz("dashboard:update"))
    .input(addDashboardWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new AddDashboardWidgetCommand(input))),
  update: privateProcedure
    .use(authz("dashboard:update"))
    .input(updateDashboardWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateDashboardWidgetCommand(input))),
  duplicate: privateProcedure
    .use(authz("dashboard:update"))
    .input(duplicateDashboardWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateDashboardWidgetCommand(input))),
  delete: privateProcedure
    .use(authz("dashboard:update"))
    .input(deleteDashboardWidgetCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteDashboardWidgetCommand(input))),
  relayout: privateProcedure
    .use(authz("dashboard:update"))
    .input(relayoutDashboardWidgetsCommand)
    .mutation(({ input }) => commandBus.execute(new RelayoutDashboardWidgetsCommand(input))),
})

const dashboardRouter = t.router({
  create: privateProcedure
    .use(authz("dashboard:create"))
    .input(createDashboardCommand)
    .mutation(({ input }) => commandBus.execute(new CreateDashboardCommand(input))),
  get: privateProcedure
    .use(authz("dashboard:read"))
    .input(getDashboardByIdQuery)
    .query(({ input }) => queryBus.execute(new GetDashboardByIdQuery(input))),
  list: privateProcedure
    .use(authz("dashboard:list"))
    .input(getDashboardsQuery)
    .query(({ input }) => queryBus.execute(new GetDashboardsQuery(input))),
  update: privateProcedure
    .use(authz("dashboard:update"))
    .input(updateDashboardCommand)
    .mutation(({ input }) => commandBus.execute(new UpdateDashboardCommand(input))),
  duplicate: privateProcedure
    .use(authz("dashboard:create"))
    .input(duplicateDashboardCommand)
    .mutation(({ input }) => commandBus.execute(new DuplicateDashboardCommand(input))),
  delete: privateProcedure
    .use(authz("dashboard:delete"))
    .input(deleteDashboardCommand)
    .mutation(({ input }) => commandBus.execute(new DeleteDashboardCommand(input))),
  widget: dashboardWidgetRouter,
})

export const route = t.router({
  table: tableRouter,
  record: recordRouter,
  webhook: webhookRouter,
  base: baseRouter,
  dashboard: dashboardRouter,
  share: shareRouter,
  authz: authzRouter,
  user: userRouter,
  space: spaceRouter,
  apiToken: apiTokenRouter,
  shareData: shareDataRouter,
  template: templateRouter,
})

export type AppRouter = typeof route
