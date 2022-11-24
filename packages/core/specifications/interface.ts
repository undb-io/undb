import { type ISpecification } from '@egodb/domain'
import { type Table } from '../table'
import type { WithName } from './table-name.specification'

export interface ITableSpecVisitor {
  nameEqual(s: WithName): void
}

export type ITableSpec = ISpecification<Table, ITableSpecVisitor>
