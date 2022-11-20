import { type Table } from './table'

export const TableRepository = Symbol('TableRepository')

export interface ITableRepository {
  findOneById(id: string): Promise<Table>
  insert(table: Table): Promise<void>
}
