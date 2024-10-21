import { AcceptInvitationCommandHandler } from "./accept-invitation.command-handler"
import { AddDashboardWidgetCommandHandler } from "./add-dashboard-widget.command-handler"
import { BulkDeleteRecordsCommandHandler } from "./bulk-delete-records.command-handler"
import { BulkDuplicateRecordsCommandHandler } from "./bulk-duplicate-records.command-handler"
import { BulkUpdateRecordsCommandHandler } from "./bulk-update-records.command-handler"
import { CreateApiTokenCommandHandler } from "./create-api-token.command-handler"
import { CreateBaseCommandHandler } from "./create-base.command-handler"
import { CreateDashboardCommandHandler } from "./create-dashboard.command-handler"
import { CreateFromShareCommandHandler } from "./create-from-share.command-handler"
import { CreateFromTemplateCommandHandler } from "./create-from-template.command-handler"
import { CreateRecordCommandHandler } from "./create-record.command-handler"
import { CreateRecordsCommandHandler } from "./create-records.command-handler"
import { CreateSpaceCommandHandler } from "./create-space.command-handler"
import { CreateTableFieldCommandHandler } from "./create-table-field.command-handler"
import { CreateTableFormCommandHandler } from "./create-table-form.command-handler"
import { CreateTableViewCommandHandler } from "./create-table-view.command-handler"
import { CreateTableCommandHandler } from "./create-table.command-handler"
import { CreateViewWidgetCommandHandler } from "./create-view-widget.command-handler"
import { CreateWebhookCommandHandler } from "./create-webhook.command-handler"
import { DeleteBaseCommandHandler } from "./delete-base.command-handler"
import { DeleteDashboardWidgetCommandHandler } from "./delete-dashboard-widget.command-handler"
import { DeleteDashboardCommandHandler } from "./delete-dashboard.command-handler"
import { DeleteInvitationCommandHandler } from "./delete-invitation.command-handler"
import { DeleteRecordCommandHandler } from "./delete-record.command-handler"
import { DeleteSpaceCommandHandler } from "./delete-space.command-handler"
import { DeleteTableFieldCommandHandler } from "./delete-table-field.command-handler"
import { DeleteFormCommandHandler } from "./delete-table-form.command-handler"
import { DeleteTableCommandHandler } from "./delete-table.command-handler"
import { DeleteViewWidgetCommandHandler } from "./delete-view-widget.command-handler"
import { DeleteViewCommandHandler } from "./delete-view.command-handler"
import { DeleteWebhookCommandHandler } from "./delete-webhook.command-handler"
import { DisableShareCommandHandler } from "./disable-share.command-handler"
import { DuplicateBaseCommandHandler } from "./duplicate-base.command-handler"
import { DuplicateDashboardWidgetCommandHandler } from "./duplicate-dashboard-widget.command-handler"
import { DuplicateDashboardCommandHandler } from "./duplicate-dashboard.command-handler"
import { DuplicateRecordCommandHandler } from "./duplicate-record.command-handler"
import { DuplicateTableFieldCommandHandler } from "./duplicate-table-field.command-handler"
import { DuplicateTableFormCommandHandler } from "./duplicate-table-form.command-handler"
import { DuplicateTableCommandHandler } from "./duplicate-table.command-handler"
import { DuplicateViewWidgetCommandHandler } from "./duplicate-view-widget.command-handler"
import { DuplicateViewCommandHandler } from "./duplicate-view.command-handler"
import { EnableShareCommandHandler } from "./enable-share.command-handler"
import { ExportViewCommandHandler } from "./export-view.command-handler"
import { InviteCommandHandler } from "./invite.command-handler"
import { RelayoutDashboardWidgetsCommandHandler } from "./relayout-dashboard-widgets.command-handler"
import { SetDefaultViewCommandHandler } from "./set-default-view.command-handler"
import { SetFieldWidthCommandHandler } from "./set-field-width.command-handler"
import { SetTableFormCommandHandler } from "./set-table-form.command-handler"
import { SetTableRLSCommandHandler } from "./set-table-rls.command-handler"
import { SetViewAggregateCommandHandler } from "./set-view-aggregate.command-handler"
import { SetViewColorCommandHandler } from "./set-view-color.command-handler"
import { SetViewFieldsCommandHandler } from "./set-view-fields.command-handler"
import { SetViewFilterCommandHandler } from "./set-view-filter.command-handler"
import { SetViewOptionCommandHandler } from "./set-view-option.command-handler"
import { SetViewSortCommandHandler } from "./set-view-sort.command-handler"
import { SubmitFormCommandHandler } from "./submit-form.command-handler"
import { TriggerRecordButtonCommandHandler } from "./trigger-record-button.command-handler"
import { UpdateAccountCommandHandler } from "./update-account.command-handler"
import { UpdateBaseCommandHandler } from "./update-base.command-handler"
import { UpdateDashboardWidgetCommandHandler } from "./update-dashboard-widget.command-handler"
import { UpdateDashboardCommandHandler } from "./update-dashboard.command-handler"
import { UpdateRecordCommandHandler } from "./update-record.command-handler"
import { UpdateSpaceCommandHandler } from "./update-space.command-handler"
import { UpdateTableFieldCommandHandler } from "./update-table-field.command-handler"
import { UpdateTableCommandHandler } from "./update-table.command-handler"
import { UpdateViewWidgetCommandHandler } from "./update-view-widget.command-handler"
import { UpdateViewCommandHandler } from "./update-view.command-handler"
import { UpdateWebhookCommandHandler } from "./update-webhook.command-handler"

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  CreateRecordsCommandHandler,
  CreateTableFieldCommandHandler,
  DeleteTableFieldCommandHandler,
  CreateWebhookCommandHandler,
  UpdateViewCommandHandler,
  UpdateWebhookCommandHandler,
  SetViewFilterCommandHandler,
  SetViewOptionCommandHandler,
  SetViewColorCommandHandler,
  SetViewFieldsCommandHandler,
  SetTableRLSCommandHandler,
  SetViewSortCommandHandler,
  UpdateRecordCommandHandler,
  DuplicateRecordCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  DeleteRecordCommandHandler,
  BulkDeleteRecordsCommandHandler,
  SetViewAggregateCommandHandler,
  CreateTableFormCommandHandler,
  SetTableFormCommandHandler,
  UpdateTableFieldCommandHandler,
  BulkUpdateRecordsCommandHandler,
  CreateTableViewCommandHandler,
  DuplicateViewCommandHandler,
  CreateFromShareCommandHandler,
  DeleteViewCommandHandler,
  CreateBaseCommandHandler,
  UpdateBaseCommandHandler,
  EnableShareCommandHandler,
  DisableShareCommandHandler,
  DuplicateTableFieldCommandHandler,
  UpdateTableCommandHandler,
  InviteCommandHandler,
  DeleteInvitationCommandHandler,
  AcceptInvitationCommandHandler,
  UpdateAccountCommandHandler,
  ExportViewCommandHandler,
  DeleteTableCommandHandler,
  CreateApiTokenCommandHandler,
  CreateSpaceCommandHandler,
  UpdateSpaceCommandHandler,
  DeleteSpaceCommandHandler,
  DeleteWebhookCommandHandler,
  DuplicateTableCommandHandler,
  DuplicateBaseCommandHandler,
  DeleteBaseCommandHandler,
  TriggerRecordButtonCommandHandler,
  DeleteFormCommandHandler,
  SubmitFormCommandHandler,
  SetFieldWidthCommandHandler,
  DuplicateTableFormCommandHandler,
  CreateFromTemplateCommandHandler,
  SetDefaultViewCommandHandler,
  CreateViewWidgetCommandHandler,
  UpdateViewWidgetCommandHandler,
  DeleteViewWidgetCommandHandler,
  CreateDashboardCommandHandler,
  AddDashboardWidgetCommandHandler,
  UpdateDashboardWidgetCommandHandler,
  DeleteDashboardWidgetCommandHandler,
  RelayoutDashboardWidgetsCommandHandler,
  DeleteDashboardCommandHandler,
  UpdateDashboardCommandHandler,
  DuplicateDashboardCommandHandler,
  DuplicateDashboardWidgetCommandHandler,
  DuplicateViewWidgetCommandHandler,
]
