import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import { Low, Memory } from 'lowdb'
import { None, Option, Some } from 'oxide.ts'
import { TableInMemoryMapper } from './table-in-memory.mapper.js'
import { TableInMemoryQueryVisitor } from './table-in-memory.query-visitor.js'
import type { TableInMemory } from './table.js'

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

  async findOneById(id: string): Promise<Option<Table>> {
    const t = this.db.data!.tables.find((t) => t.id === id)
    if (!t) return None

    const table = TableInMemoryMapper.toDomain(t).unwrap()
    return Some(table)
  }

  async findOne(spec: ITableSpec): Promise<Option<Table>> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.mustGetPredicate().unwrap()

    const t = this.db.data!.tables.find(predicate)
    return t ? Some(TableInMemoryMapper.toDomain(t).unwrap()) : None
  }

  async find(spec: ITableSpec): Promise<Table[]> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.mustGetPredicate().unwrap()

    return this.db
      .data!.tables.filter(predicate)
      .map(TableInMemoryMapper.toDomain)
      .map((t) => t.unwrap())
  }

  async insert(table: Table): Promise<void> {
    this.db.data!.tables.push({ id: table.id, name: table.name.value })
  }
}
