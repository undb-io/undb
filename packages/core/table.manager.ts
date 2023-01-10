import type { Table } from './table'

export interface ITableManager {
  create(table: Table): Promise<void>
}
