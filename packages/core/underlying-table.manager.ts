import type { ITableSpec } from './specifications/index.js'
import type { Table } from './table.js'

export interface IUnderlyingTableManager {
  create(table: Table): Promise<void>
  update(tableId: string, spec: ITableSpec): Promise<void>
  delete(tableId: string): Promise<void>
}
