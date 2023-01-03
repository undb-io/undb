import type { Option } from 'oxide.ts'
import type { Record } from './record'
import type { IRecordSpec } from './specifications/interface'

export interface IRecordRepository {
  insert(record: Record): Promise<void>
  findOneById(id: string): Promise<Option<Record>>

  updateOneById(id: string, spec: IRecordSpec): Promise<void>
}
