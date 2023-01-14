import type { Option } from 'oxide.ts'
import type { TableSchemaIdMap } from '../value-objects'
import type { IQueryRecordSchema } from './record.type'
import type { IRecordSpec } from './specifications'

export interface IRecordQueryModel {
  findOne(spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  findOneById(id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>>
  find(spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryRecordSchema[]>
}
