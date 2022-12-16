import type { ISpecVisitor } from '@egodb/domain'
import { type ISpecification } from '@egodb/domain'
import { type Table } from '../table'
import type { WithFilter } from './filters.specificaiton'
import type { WithNewField } from './table-field.specification'
import type { WithTableId } from './table-id.specifaction'
import type { WithTableName } from './table-name.specification'

export interface ITableSpecVisitor extends ISpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithTableName): void

  filterEqual(s: WithFilter): void
  newField(s: WithNewField): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>
