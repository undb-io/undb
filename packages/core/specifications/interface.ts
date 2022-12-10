import { type ISpecification } from '@egodb/domain'
import { type Table } from '../table'
import type { WithFilters } from './filters.specificaiton'
import type { WithTableId } from './table-id.specifaction'
import type { WithName } from './table-name.specification'

export interface ITableSpecVisitor {
  idEqual(s: WithTableId): void
  nameEqual(s: WithName): void

  filtersEqual(s: WithFilters): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>
