import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import type { WithOptions } from '../field/specifications/select-field.specification'
import { type Table } from '../table'
import type { WithKanbanField } from '../view'
import type { WithDisplayType } from '../view/specifications/display-type.specification'
import type { WithFilter } from './filters.specificaiton'
import type { WithNewField } from './table-field.specification'
import type { WithTableId } from './table-id.specifaction'
import type { WithTableName } from './table-name.specification'
import type { WithTableSchema } from './table-schema.specification'
import type { WithFieldVisibility, WithFieldWidth } from './table-view-field-option.specification'
import type { WithViewFieldsOrder } from './table-view-fields-order.specification'
import type { WithTableView, WithTableViews } from './table-views.specification'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void
  schemaEqual(s: WithTableSchema): void
  viewsEqual(s: WithTableViews): void
  viewEqual(s: WithTableView): void

  filterEqual(s: WithFilter): void
  newField(s: WithNewField): void

  fieldsOrder(s: WithViewFieldsOrder): void
  fieldWidthEqual(s: WithFieldWidth): void
  fieldVisibility(s: WithFieldVisibility): void

  displayTypeEqual(s: WithDisplayType): void
  kanbanFieldEqual(s: WithKanbanField): void
  optionsEqual(s: WithOptions): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>

export type TableCompositeSpecificaiton = CompositeSpecification<Table, ITableSpecVisitor>
