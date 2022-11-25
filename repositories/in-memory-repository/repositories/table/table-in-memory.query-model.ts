import type { ITableQueryModel, ITableSpec, QueryTable } from '@egodb/core'
import type { Option } from 'oxide.ts'
import { db } from './db'

export class TableInMemoryQueryModel implements ITableQueryModel {
  async find(): Promise<QueryTable[]> {
    return db.data?.tables ?? []
  }
  findOne(spec: ITableSpec): Promise<Option<QueryTable>> {
    throw new Error('Method not implemented.')
  }
  findOneById(id: string): Promise<Option<QueryTable>> {
    throw new Error('Method not implemented.')
  }
}
