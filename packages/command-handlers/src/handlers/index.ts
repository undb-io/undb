import { CreateRecordCommandHandler } from "./create-record.command-handler"
import { CreateTableFieldCommandHandler } from "./create-table-field.command-handler"
import { CreateTableFormCommandHandler } from "./create-table-form.command-handler"
import { CreateTableCommandHandler } from "./create-table.command-handler"
import { SetTableRLSCommandHandler } from "./set-table-rls.command-handler"
import { SetViewAggregateCommandHandler } from "./set-view-aggregate.command-handler"
import { SetViewColorCommandHandler } from "./set-view-color.command-handler"
import { SetViewFilterCommandHandler } from "./set-view-filter.command-handler"
import { SetViewSortCommandHandler } from "./set-view-sort.command-handler"
import { UpdateRecordCommandHandler } from "./update-record.command-handler"

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  CreateTableFieldCommandHandler,
  SetViewFilterCommandHandler,
  SetViewColorCommandHandler,
  SetTableRLSCommandHandler,
  SetViewSortCommandHandler,
  UpdateRecordCommandHandler,
  SetViewAggregateCommandHandler,
  CreateTableFormCommandHandler,
]
