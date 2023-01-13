import type { ITableSpec } from './specifications'
import type { Table } from './table'

export interface IUnderlyingTableManager {
  create(table: Table): Promise<void>
  update(tableId: string, spec: ITableSpec): Promise<void>
  delete(tableId: string): Promise<void>
}
