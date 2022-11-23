import { ITableRepository, Table } from '@egodb/core'

export class TableInMemoryRepository implements ITableRepository {
  findOneById(id: string): Promise<Table> {
    throw new Error('Method not implemented.')
  }
  insert(table: Table): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
