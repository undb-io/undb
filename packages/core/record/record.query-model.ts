import type { Option } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects'
import type { IQueryRecords, IQueryRecordSchema } from './record.type'
import type { IRecordSpec } from './specifications'

export interface IRecordQueryModel {
  findOne(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryRecords>
}
