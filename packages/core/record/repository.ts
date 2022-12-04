import type { Record } from './record'

export interface IRecordRepository {
  insert(record: Record): Promise<void>
}
