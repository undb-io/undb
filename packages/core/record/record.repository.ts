import type { Option } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects/index.js'
import type { Record } from './record.js'
import type { IRecordSpec } from './specifications/interface.js'

export interface IRecordRepository {
  insert(record: Record, schema: TableSchemaIdMap): Promise<void>
  insertMany(records: Record[], schema: TableSchemaIdMap): Promise<void>

  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<Record>>
  find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Record[]>

  updateOneById(tableId: string, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void>

  deleteOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<void>
  deleteManyByIds(tableId: string, ids: string[], schema: TableSchemaIdMap): Promise<void>
}
