import type { Option } from 'oxide.ts'
import type { QueryRecord } from './query-record.schema'
import type { IRecordSpec } from './specifications'

export interface IRecordQueryModel {
  findOne(spec: IRecordSpec): Promise<Option<QueryRecord>>
  findOneById(id: string): Promise<Option<QueryRecord>>
  find(): Promise<QueryRecord[]>
}
