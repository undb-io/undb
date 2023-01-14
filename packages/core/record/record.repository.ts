import type { Option } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects'
import type { Record } from './record'
import type { IRecordSpec } from './specifications/interface'

export interface IRecordRepository {
  insert(record: Record): Promise<void>
  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<Record>>

  updateOneById(tableId: string, id: string, spec: IRecordSpec): Promise<void>
  deleteOneById(tableId: string, id: string): Promise<void>
}
