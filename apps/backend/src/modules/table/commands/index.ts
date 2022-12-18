import { SetFieldVisibilityCommandHandler } from '@egodb/core'
import { CreateFieldCommandHandler } from './create-field.command.handler'
import { CreateRecordCommandHandler } from './create-record.command.handler'
import { CreateTableCommandHandler } from './create-table.command.handler'
import { EditTableCommandHandler } from './edit-table.command.handler'
import { SetFieldWidthCommandHandler } from './set-field-width.command.handler'
import { SetFiltersCommandHandler } from './set-filters.command.handler'

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  CreateFieldCommandHandler,
  SetFiltersCommandHandler,
  SetFieldWidthCommandHandler,
  SetFieldVisibilityCommandHandler,
  EditTableCommandHandler,
]
