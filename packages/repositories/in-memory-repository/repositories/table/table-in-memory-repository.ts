import type { ITableRepository, ITableSpec, Table } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db.js'
import { TableInMemoryMapper } from './table-in-memory.mapper.js'
import { TableInMemoryQueryVisitor } from './table-in-memory.query-visitor.js'

export class TableInMemoryRepository implements ITableRepository {
  async findOneById(id: string): Promise<Option<Table>> {
    const t = db.data?.tables.find((t) => t.id === id)
    if (!t) return None

    const table = TableInMemoryMapper.toDomain(t).unwrap()
    return Some(table)
  }

  async findOne(spec: ITableSpec): Promise<Option<Table>> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.getPredicate().unwrap()

    const t = db.data?.tables.find(predicate)
    return t ? Some(TableInMemoryMapper.toDomain(t).unwrap()) : None
  }

  async find(spec: ITableSpec): Promise<Table[]> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)

    const predicate = visitor.getPredicate().unwrap()

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return db
      .data!.tables.filter(predicate)
      .map(TableInMemoryMapper.toDomain)
      .map((t) => t.unwrap())
  }

  async insert(table: Table): Promise<void> {
    const t = TableInMemoryMapper.toInMemory(table)
    db.data?.tables.push(t)
  }
}
