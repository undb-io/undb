import type { IQueryRecordSchema, IRecordQueryModel, IRecordSpec, QueryRecords } from '@egodb/core'
import { WithRecordIdS } from '@egodb/core'
import { Option } from 'oxide.ts'
import { db } from '../db'
import { RecordInMemoryQueryVisitor } from './record-in-memory.query-visitor'

export class RecordInMemoryQueryModel implements IRecordQueryModel {
  async find(spec: IRecordSpec): Promise<QueryRecords> {
    const visitor = new RecordInMemoryQueryVisitor()
    spec.accept(visitor).unwrap()

    return db.data?.records.filter(visitor.getPredicate().unwrap()) ?? []
  }

  async findOne(spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    const visitor = new RecordInMemoryQueryVisitor()
    spec.accept(visitor).unwrap()

    const found = db.data?.records.find(visitor.getPredicate().unwrap())
    return Option(found)
  }

  findOneById(id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(WithRecordIdS(id))
  }
}
