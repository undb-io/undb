import { CreateRecordCommandHandler } from './create-record.command-handler'
import { CreateTableCommandHandler } from './create-table.command-handler'
import { SetViewFilterCommandHandler } from './set-view-filter.command-handler'

export const commandHandlers = [CreateTableCommandHandler, CreateRecordCommandHandler, SetViewFilterCommandHandler]
