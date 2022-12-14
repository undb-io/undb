import type { IQueryTable, ITableQueryModel, ITableSpec } from '@egodb/core'
import { WithTableId } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db'
import { TableInMemoryMapper } from './table-in-memory.mapper'
import { TableInMemoryQueryVisitor } from './table-in-memory.query-visitor'

export class TableInMemoryQueryModel implements ITableQueryModel {
  async find(): Promise<IQueryTable[]> {
    return db.data?.tables ?? []
  }

  async findOne(spec: ITableSpec): Promise<Option<IQueryTable>> {
    const visitor = new TableInMemoryQueryVisitor()
    spec.accept(visitor)
    const table = db.data?.tables.find(visitor.getPredicate().unwrap())
    if (!table) return None

    return TableInMemoryMapper.toDomain(table)
      .map((t) => t.toQueryModel())
      .map((t) => Some(t))
      .unwrap()
  }

  findOneById(id: string): Promise<Option<IQueryTable>> {
    return this.findOne(WithTableId.fromString(id).unwrap())
  }
}
