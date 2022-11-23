import { ITableRepository, Table } from '@egodb/core'
import { Low, Memory } from 'lowdb'
import { TableInMemory } from './table.js'

type Data = {
  tables: TableInMemory[]
}

export class TableInMemoryRepository implements ITableRepository {
  private readonly db = new Low(new Memory<Data>())
  constructor() {
    this.db.data ||= {
      tables: [],
    }
  }

  findOneById(id: string): Promise<Table> {
    throw new Error('Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    this.db.data!.tables.push({ id: table.id, name: table.name })
  }
}
