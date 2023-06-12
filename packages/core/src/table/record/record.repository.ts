import type { Option } from 'oxide.ts'
import type { Table } from '../table.js'
import type { TableSchemaIdMap } from '../value-objects/index.js'
import type { Record } from './record.js'
import type { IRecordSpec } from './specifications/interface.js'

export interface IRecordRepository {
  insert(table: Table, record: Record, schema: TableSchemaIdMap): Promise<void>
  insertMany(table: Table, records: Record[], schema: TableSchemaIdMap): Promise<void>

  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<Record>>
  findOne(tableId: string, spec: IRecordSpec | null, schema: TableSchemaIdMap): Promise<Option<Record>>
  find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Record[]>

  updateOneById(table: Table, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void>
  updateManyByIds(
    tableId: string,
    schema: TableSchemaIdMap,
    updates: { id: string; spec: IRecordSpec }[],
  ): Promise<void>

  deleteOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<void>
  deleteManyByIds(tableId: string, ids: string[], schema: TableSchemaIdMap): Promise<void>
}
