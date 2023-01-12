import type { ITableSpec } from './specifications'
import type { Table } from './table'

export interface IUnderlyingTableManager {
  create(table: Table): Promise<void>
  update(table: Table, spec: ITableSpec): Promise<void>
}
