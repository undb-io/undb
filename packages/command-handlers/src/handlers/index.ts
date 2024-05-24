import { CreateRecordCommandHandler } from "./create-record.command-handler"
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
  SetViewFilterCommandHandler,
  SetViewColorCommandHandler,
  SetTableRLSCommandHandler,
  SetViewSortCommandHandler,
  UpdateRecordCommandHandler,
  SetViewAggregateCommandHandler,
]
