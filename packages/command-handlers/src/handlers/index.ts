import { CreateBaseCommandHandler } from "./create-base.command-handler"
import { CreateRecordCommandHandler } from "./create-record.command-handler"
import { CreateRecordsCommandHandler } from "./create-records.command-handler"
import { CreateTableFieldCommandHandler } from "./create-table-field.command-handler"
import { CreateTableFormCommandHandler } from "./create-table-form.command-handler"
import { CreateTableViewCommandHandler } from "./create-table-view.command-handler"
import { CreateTableCommandHandler } from "./create-table.command-handler"
import { CreateWebhookCommandHandler } from "./create-webhook.command-handler"
import { DeleteRecordCommandHandler } from "./delete-record.command-handler"
import { DeleteViewCommandHandler } from "./delete-view.command-handler"
import { DisableShareCommandHandler } from "./disable-share.command-handler"
import { DuplicateRecordCommandHandler } from "./duplicate-record.command-handler"
import { DuplicateViewCommandHandler } from "./duplicate-view.command-handler"
import { EnableShareCommandHandler } from "./enable-share.command-handler"
import { SetTableFormCommandHandler } from "./set-table-form.command-handler"
import { SetTableRLSCommandHandler } from "./set-table-rls.command-handler"
import { SetViewAggregateCommandHandler } from "./set-view-aggregate.command-handler"
import { SetViewColorCommandHandler } from "./set-view-color.command-handler"
import { SetViewFieldsCommandHandler } from "./set-view-fields.command-handler"
import { SetViewFilterCommandHandler } from "./set-view-filter.command-handler"
import { SetViewOptionCommandHandler } from "./set-view-option.command-handler"
import { SetViewSortCommandHandler } from "./set-view-sort.command-handler"
import { UpdateBaseCommandHandler } from "./update-base.command-handler"
import { UpdateRecordCommandHandler } from "./update-record.command-handler"
import { UpdateTableFieldCommandHandler } from "./update-table-field.command-handler"
import { UpdateViewCommandHandler } from "./update-view.command-handler"
import { UpdateWebhookCommandHandler } from "./update-webhook.command-handler"

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  CreateRecordsCommandHandler,
  CreateTableFieldCommandHandler,
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
  DeleteRecordCommandHandler,
  SetViewAggregateCommandHandler,
  CreateTableFormCommandHandler,
  SetTableFormCommandHandler,
  UpdateTableFieldCommandHandler,
  CreateTableViewCommandHandler,
  DuplicateViewCommandHandler,
  DeleteViewCommandHandler,
  CreateBaseCommandHandler,
  UpdateBaseCommandHandler,
  EnableShareCommandHandler,
  DisableShareCommandHandler,
]
