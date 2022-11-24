import { ITableRepository, Table } from '@egodb/core'
import { ITableSpec } from '@egodb/core/dist/specifications/interface.js'
import { Low, Memory } from 'lowdb'
import { Option } from 'oxide.ts'
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

  findOneById(id: string): Promise<Option<Table>> {
    throw new Error('Method not implemented.')
  }

  findOne(spec: ITableSpec): Promise<Option<Table>> {
    throw new Error('Method not implemented.')
  }

  find(spec: ITableSpec): Promise<Table[]> {
    throw new Error('Method not implemented.')
  }

  async insert(table: Table): Promise<void> {
    this.db.data!.tables.push({ id: table.id, name: table.name.value })
  }
}
