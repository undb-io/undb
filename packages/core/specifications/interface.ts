import type { CompositeSpecification, ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Table } from '../table'
import type { WithFilter } from './filters.specificaiton'
import type { WithNewField } from './table-field.specification'
import type { WithTableId } from './table-id.specifaction'
import type { WithTableName } from './table-name.specification'
import type { WithTableSchema } from './table-schema.specification'
import type { WithFieldVisibility, WithFieldWidth } from './table-view-field-option.specification'
import type { WithTableViews } from './table-views.specification'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void
  schemaEqual(s: WithTableSchema): void
  viewsEqual(s: WithTableViews): void

  filterEqual(s: WithFilter): void
  newField(s: WithNewField): void

  fieldWidthEqual(s: WithFieldWidth): void
  fieldVisibility(s: WithFieldVisibility): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>

export type TableCompositeSpecificaiton = CompositeSpecification<Table, ITableSpecVisitor>
