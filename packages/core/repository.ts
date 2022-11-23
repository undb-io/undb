import { type Table } from './table'

export interface ITableRepository {
  findOneById(id: string): Promise<Table>

  insert(table: Table): Promise<void>
}
