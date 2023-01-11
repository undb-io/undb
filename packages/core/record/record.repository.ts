import type { Option } from 'oxide.ts'
import type { TableSchemaMap } from '../value-objects'
import type { Record } from './record'
import type { IRecordSpec } from './specifications/interface'

export interface IRecordRepository {
  insert(record: Record): Promise<void>
  findOneById(tableId: string, id: string, schema: TableSchemaMap): Promise<Option<Record>>

  updateOneById(tableId: string, id: string, spec: IRecordSpec): Promise<void>
}
