import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import type { WithFieldName } from '../field/specifications/base-field.specification.js'
import type { WithFormat } from '../field/specifications/date-field.specification.js'
import type { WithoutField } from '../field/specifications/field.specification.js'
import type { WithDisplayFields } from '../field/specifications/reference-field.specification.js'
import type { WithNewOption, WithOptions, WithoutOption } from '../field/specifications/select-field.specification.js'
import { type Table } from '../table.js'
import type { WithKanbanField, WithViewsOrder } from '../view/index.js'
import type { WithCalendarField } from '../view/specifications/calendar.specification.js'
import type { WithDisplayType } from '../view/specifications/display-type.specification.js'
import type { WithFilter } from '../view/specifications/filters.specificaiton.js'
import type { WithShowSystemFieldsSpec } from '../view/specifications/show-system-fields.specification.js'
import type { WithSorts } from '../view/specifications/sorts.specification.js'
import type { WithTreeViewField } from '../view/specifications/tree-view.specification.js'
import type {
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
} from '../view/specifications/view-field-option.specification.js'
import type { WithViewFieldsOrder } from '../view/specifications/view-fields-order.specification.js'
import type { WithViewPinnedFields } from '../view/specifications/view-pinned-fields.specification.js'
import type {
  WithNewView,
  WithoutView,
  WithTableView,
  WithTableViews,
  WithViewName,
} from '../view/specifications/views.specification.js'
import type { WithNewField } from './table-field.specification.js'
import type { WithTableId } from './table-id.specification'
import type { WithTableName } from './table-name.specification.js'
import type { WithTableSchema } from './table-schema.specification.js'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void
  schemaEqual(s: WithTableSchema): void
  viewsEqual(s: WithTableViews): void
  viewEqual(s: WithTableView): void
  viewNameEqual(s: WithViewName): void
  newView(s: WithNewView): void
  withoutView(s: WithoutView): void
  viewsOrderEqual(s: WithViewsOrder): void

  sortsEqual(s: WithSorts): void

  filterEqual(s: WithFilter): void
  fieldsOrder(s: WithViewFieldsOrder): void
  fieldOptionsEqual(s: WithFieldOption): void
  fieldWidthEqual(s: WithFieldWidth): void
  fieldVisibility(s: WithFieldVisibility): void
  pinnedFields(s: WithViewPinnedFields): void

  displayTypeEqual(s: WithDisplayType): void
  kanbanFieldEqual(s: WithKanbanField): void
  calendarFieldEqual(s: WithCalendarField): void
  treeViewFieldEqual(s: WithTreeViewField): void

  newField(s: WithNewField): void
  withoutField(s: WithoutField): void

  optionsEqual(s: WithOptions): void
  optionEqual(s: WithNewOption): void
  newOption(s: WithNewOption): void
  witoutOption(s: WithoutOption): void

  withFieldName(s: WithFieldName): void
  displayFieldsEqual(s: WithDisplayFields): void
  withFormat(s: WithFormat): void

  withShowSystemFields(s: WithShowSystemFieldsSpec): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>

export type TableCompositeSpecificaiton = CompositeSpecification<Table, ITableSpecVisitor>
