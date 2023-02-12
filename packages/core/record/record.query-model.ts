import type { Option } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects/index.js'
import type { ISorts } from '../view/index.js'
import type { IQueryRecords, IQueryRecordSchema } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordQueryModel {
  findOne(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap, sorts: ISorts): Promise<IQueryRecords>
}
