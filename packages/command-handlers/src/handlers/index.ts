import { CreateRecordCommandHandler } from "./create-record.command-handler"
import { CreateTableCommandHandler } from "./create-table.command-handler"
import { SetTableRLSCommandHandler } from "./set-table-rls.command-handler"
import { SetViewColorCommandHandler } from "./set-view-color.command-handler"
import { SetViewFilterCommandHandler } from "./set-view-filter.command-handler"
import { SetViewSortCommandHandler } from "./set-view-sort.command-handler"

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  SetViewFilterCommandHandler,
  SetViewColorCommandHandler,
  SetTableRLSCommandHandler,
  SetViewSortCommandHandler,
]
