import type { IQueryRecordSchema, IRecordQueryModel, IRecordSpec, QueryRecords } from '@egodb/core'
import { WithRecordIdS } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { db } from '../db'

export class RecordInMemoryQueryModel implements IRecordQueryModel {
  async find(): Promise<QueryRecords> {
    return db.data?.records ?? []
  }

  async findOne(spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    throw new Error('unimplemented')
  }

  findOneById(id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(WithRecordIdS(id))
  }
}
