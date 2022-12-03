import type { IRecordQueryModel, IRecordSpec, QueryRecord } from '@egodb/core'
import { WithRecordIdS } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { db } from '../db'
import { RecordInMemoryMapper } from './record-in-memory.mapper'
import { RecordInMemoryQueryVisitor } from './record-in-memory.query-visitor'

export class RecordInMemoryQueryModel implements IRecordQueryModel {
  async find(): Promise<QueryRecord[]> {
    return db.data?.tables ?? []
  }

  async findOne(spec: IRecordSpec): Promise<Option<QueryRecord>> {
    const visitor = new RecordInMemoryQueryVisitor()
    spec.accept(visitor)
    const table = db.data?.tables.find(visitor.getPredicate().unwrap())
    if (!table) return None

    const qt = RecordInMemoryMapper.toQueryModel(RecordInMemoryMapper.toDomain(table).unwrap())
    return Some(qt)
  }

  findOneById(id: string): Promise<Option<QueryRecord>> {
    return this.findOne(WithRecordIdS(id))
  }
}
