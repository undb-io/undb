import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import type { WithoutField } from '../field/specifications/field.specification'
import type { WithNewOption, WithOptions, WithoutOption } from '../field/specifications/select-field.specification'
import { type Table } from '../table'
import type { WithKanbanField } from '../view'
import type { WithCalendarField } from '../view/specifications/calendar.specification'
import type { WithDisplayType } from '../view/specifications/display-type.specification'
import type { WithFilter } from '../view/specifications/filters.specificaiton'
import type { WithSorts } from '../view/specifications/sorts.specification'
import type {
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
} from '../view/specifications/view-field-option.specification'
import type { WithViewFieldsOrder } from '../view/specifications/view-fields-order.specification'
import type { WithTableView, WithTableViews } from '../view/specifications/views.specification'
import type { WithNewField } from './table-field.specification'
import type { WithTableId } from './table-id.specifaction'
import type { WithTableName } from './table-name.specification'
import type { WithTableSchema } from './table-schema.specification'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void
  schemaEqual(s: WithTableSchema): void
  viewsEqual(s: WithTableViews): void
  viewEqual(s: WithTableView): void

  sortsEqual(s: WithSorts): void

  filterEqual(s: WithFilter): void
  fieldsOrder(s: WithViewFieldsOrder): void
  fieldOptionsEqual(s: WithFieldOption): void
  fieldWidthEqual(s: WithFieldWidth): void
  fieldVisibility(s: WithFieldVisibility): void

  displayTypeEqual(s: WithDisplayType): void
  kanbanFieldEqual(s: WithKanbanField): void
  calendarFieldEqual(s: WithCalendarField): void

  newField(s: WithNewField): void
  withoutField(s: WithoutField): void

  optionsEqual(s: WithOptions): void
  optionEqual(s: WithNewOption): void
  newOption(s: WithNewOption): void
  witoutOption(s: WithoutOption): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>

export type TableCompositeSpecificaiton = CompositeSpecification<Table, ITableSpecVisitor>
