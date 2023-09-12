import { BulkDeleteRecordsCommandHandler } from './bulk-delete-record.command.handler.js'
import { BulkDuplicateRecordsCommandHandler } from './bulk-duplicate-record.command.handler.js'
import { CreateFieldCommandHandler } from './create-field.command.handler.js'
import { CreateFormFromViewCommandHandler } from './create-form-from-view.command.handler.js'
import { CreateFormCommandHandler } from './create-form.command.handler.js'
import { CreateOptionCommandHandler } from './create-option.command.handler.js'
import { CreateRecordCommandHandler } from './create-record.command.handler.js'
import { CreateRecordsCommandHandler } from './create-records.command.handler.js'
import { CreateTableCommandHandler } from './create-table.command.handler.js'
import { CreateViewCommandHandler } from './create-view.command.handler.js'
import { CreateWidgetCommandHandler } from './create-widget.command.handler.js'
import { DeleteFieldCommandHandler } from './delete-field.command.handler.js'
import { DeleteFormCommandHandler } from './delete-form.command.handler.js'
import { DeleteOptionCommandHandler } from './delete-option.command.handler.js'
import { DeleteRecordCommandHandler } from './delete-record.command.handler.js'
import { DeleteTableCommandHandler } from './delete-table.command.handler.js'
import { DeleteViewCommandHandler } from './delete-view.command.handler.js'
import { DeleteWidgetCommandHandler } from './delete-widget.command.handler.js'
import { DuplicateFieldCommandHandler } from './duplicate-field.command.handler.js'
import { DuplicateRecordCommandHandler } from './duplicate-record.command.handler.js'
import { DuplicateViewCommandHandler } from './duplicate-view.command.handler.js'
import { ExportGridCommandHandler } from './export-grid.command.handler.js'
import { MoveFieldCommandHandler } from './move-field.command.handler.js'
import { MoveViewCommandHandler } from './move-view.command.handler.js'
import { RelayoutWidgetsCommandHandler } from './relayout-widgets.command.handler.js'
import { ReorderOptionsCommandHandler } from './reorder-options.command.handler.js'
import { ResetFieldSortCommandHandler } from './reset-field-sort.command.handler.js'
import { RestoreRecordCommandHandler } from './restore-record.command.handler.js'
import { SetCalendarFieldCommandHandler } from './set-calendar-field.command.handler.js'
import { SetFieldDisplayCommandHandler } from './set-field-display.command.handler.js'
import { SetFieldSortCommandHandler } from './set-field-sort.command.handler.js'
import { SetFieldVisibilityCommandHandler } from './set-field-visibility.command.handler.js'
import { SetFieldWidthCommandHandler } from './set-field-width.command.handler.js'
import { SetFiltersCommandHandler } from './set-filters.command.handler.js'
import { SetFormFieldFilterCommandHandler } from './set-form-field-filter.command.handler.js'
import { SetFormFieldRequirementsCommandHandler } from './set-form-field-requirements.command.handler.js'
import { SetFormFieldVisibilityCommandHandler } from './set-form-field-visibility.command.handler.js'
import { SetFormFieldsOrderCommandHandler } from './set-form-fields-order.command.handler.js'
import { SetGalleryFieldCommandHandler } from './set-gallery-field.command.handler.js'
import { SetGanttFieldCommandHandler } from './set-gantt-field.command.handler.js'
import { SetKanbanFieldCommandHandler } from './set-kanban-field.command.handler.js'
import { SetPinnedFieldsCommandHandler } from './set-pinned-fields.command.handler.js'
import { SetRowHeightCommandHandler } from './set-row-height.command.handler.js'
import { SetShowSystemFieldsCommandHandler } from './set-show-system-fields.command.handler.js'
import { SetSortsCommandHandler } from './set-sorts.command.handler.js'
import { SetTreeViewFieldCommandHandler } from './set-tree-view-field.command.handler.js'
import { SwitchDisplayTypeCommandHandler } from './switch-display-type.command.handler.js'
import { UpdateFieldCommandHandler } from './update-field.command.handler.js'
import { UpdateFormCommandHandler } from './update-form.command.handler.js'
import { UpdateOptionCommandHandler } from './update-option.command.handler.js'
import { UpdateRecordCommandHandler } from './update-record.command.handler.js'
import { UpdateRecordsCommandHandler } from './update-records.command.handler.js'
import { UpdateTableCommandHandler } from './update-table.command.handler.js'
import { UpdateViewNameCommandHandler } from './update-view-name.command.handler.js'
import { UpdateVisualizationCommandHandler } from './update-visualization.command.handler.js'

export const commandHandlers = [
  CreateTableCommandHandler,
  CreateRecordCommandHandler,
  CreateRecordsCommandHandler,
  UpdateRecordCommandHandler,
  UpdateRecordsCommandHandler,
  DuplicateRecordCommandHandler,
  BulkDuplicateRecordsCommandHandler,
  CreateFieldCommandHandler,
  CreateViewCommandHandler,
  CreateOptionCommandHandler,
  SetFiltersCommandHandler,
  SetSortsCommandHandler,
  CreateWidgetCommandHandler,
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
  SetRowHeightCommandHandler,
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
  RelayoutWidgetsCommandHandler,
  UpdateVisualizationCommandHandler,
  DeleteWidgetCommandHandler,
  DuplicateFieldCommandHandler,
  ExportGridCommandHandler,
  SetGanttFieldCommandHandler,
  CreateFormCommandHandler,
  CreateFormFromViewCommandHandler,
  SetFormFieldVisibilityCommandHandler,
  SetFormFieldRequirementsCommandHandler,
  SetFormFieldsOrderCommandHandler,
  SetGalleryFieldCommandHandler,
  UpdateFormCommandHandler,
  RestoreRecordCommandHandler,
  SetFormFieldFilterCommandHandler,
  SetFieldDisplayCommandHandler,
  DeleteFormCommandHandler,
]
