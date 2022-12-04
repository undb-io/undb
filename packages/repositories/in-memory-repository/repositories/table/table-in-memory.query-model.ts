import type { ITableQueryModel, ITableSpec, QueryTable } from '@egodb/core'
import { WithTableIdS } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db'
import { TableInMemoryMapper } from './table-in-memory.mapper'
import { TableInMemoryQueryVisitor } from './table-in-memory.query-visitor'

export class TableInMemoryQueryModel implements ITableQueryModel {
  async find(): Promise<QueryTable[]> {
    return db.data?.tables ?? []
  }

  async findOne(spec: ITableSpec): Promise<Option<QueryTable>> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)
    const table = db.data?.tables.find(visitor.getPredicate().unwrap())
    if (!table) return None

    const qt = TableInMemoryMapper.toQueryModel(TableInMemoryMapper.toDomain(table).unwrap())
    return Some(qt)
  }

  findOneById(id: string): Promise<Option<QueryTable>> {
    return this.findOne(WithTableIdS(id))
  }
}
