import { CreateRecordCommandHandler } from './create-record.command.handler'
import { CreateTableCommandHandler } from './create-table.command.handler'
import { SetFiltersCommandHandler } from './set-filters.command.handler'

export const commandHandlers = [CreateTableCommandHandler, CreateRecordCommandHandler, SetFiltersCommandHandler]
