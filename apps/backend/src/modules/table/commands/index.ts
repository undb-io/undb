import { BulkDeleteRecordsCommandHandler } from './bulk-delete-record.command.handler.js'
import { BulkDuplicateRecordsCommandHandler } from './bulk-duplicate-record.command.handler.js'
import { CreateFieldCommandHandler } from './create-field.command.handler.js'
import { CreateOptionCommandHandler } from './create-option.command.handler.js'
import { CreateRecordCommandHandler } from './create-record.command.handler.js'
import { CreateTableCommandHandler } from './create-table.command.handler.js'
import { CreateViewCommandHandler } from './create-view.command.handler.js'
import { DeleteFieldCommandHandler } from './delete-field.command.handler.js'
import { DeleteOptionCommandHandler } from './delete-option.command.handler.js'
import { DeleteRecordCommandHandler } from './delete-record.command.handler.js'
import { DeleteTableCommandHandler } from './delete-table.command.handler.js'
import { DeleteViewCommandHandler } from './delete-view.command.handler.js'
import { DuplicateRecordCommandHandler } from './duplicate-record.command.handler.js'
import { DuplicateViewCommandHandler } from './duplicate-view.command.handler.js'
import { MoveFieldCommandHandler } from './move-field.command.handler.js'
import { MoveViewCommandHandler } from './move-view.command.handler.js'
import { ReorderOptionsCommandHandler } from './reorder-options.command.handler.js'
import { ResetFieldSortCommandHandler } from './reset-field-sort.command.handler.js'
import { SetCalendarFieldCommandHandler } from './set-calendar-field.command.handler.js'
import { SetFieldSortCommandHandler } from './set-field-sort.command.handler.js'
import { SetFieldVisibilityCommandHandler } from './set-field-visibility.command.handler.js'
import { SetFieldWidthCommandHandler } from './set-field-width.command.handler.js'
import { SetFiltersCommandHandler } from './set-filters.command.handler.js'
import { SetKanbanFieldCommandHandler } from './set-kanban-field.command.handler.js'
import { SetPinnedFieldsCommandHandler } from './set-pinned-fields.command.handler.js'
import { SetShowSystemFieldsCommandHandler } from './set-show-system-fields.command.handler.js'
import { SetSortsCommandHandler } from './set-sorts.command.handler.js'
import { SetTreeViewFieldCommandHandler } from './set-tree-view-field.command.handler.js'
import { SwitchDisplayTypeCommandHandler } from './switch-display-type.command.handler.js'
import { UpdateFieldCommandHandler } from './update-field.command.handler.js'
import { UpdateOptionCommandHandler } from './update-option.command.handler.js'
import { UpdateRecordCommandHandler } from './update-record.command.handler.js'
import { UpdateTableCommandHandler } from './update-table.command.handler.js'
import { UpdateViewNameCommandHandler } from './update-view-name.command.handler.js'

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  DuplicateRecordCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  CreateFieldCommandHandler,
  CreateViewCommandHandler,
  CreateOptionCommandHandler,
  SetFiltersCommandHandler,
  SetSortsCommandHandler,
  SetKanbanFieldCommandHandler,
  SetCalendarFieldCommandHandler,
  SetPinnedFieldsCommandHandler,
  SetTreeViewFieldCommandHandler,
  SetFieldWidthCommandHandler,
  SetFieldVisibilityCommandHandler,
  SetShowSystemFieldsCommandHandler,
  ResetFieldSortCommandHandler,
  SetFieldSortCommandHandler,
  MoveFieldCommandHandler,
  MoveViewCommandHandler,
  UpdateTableCommandHandler,
  ReorderOptionsCommandHandler,
  SwitchDisplayTypeCommandHandler,
  UpdateRecordCommandHandler,
  UpdateOptionCommandHandler,
  DeleteRecordCommandHandler,
  BulkDeleteRecordsCommandHandler,
  DeleteTableCommandHandler,
  DeleteOptionCommandHandler,
  DeleteFieldCommandHandler,
  DeleteViewCommandHandler,
  DuplicateViewCommandHandler,
  UpdateViewNameCommandHandler,
  UpdateFieldCommandHandler,
]
