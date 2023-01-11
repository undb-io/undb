import type { Option } from 'oxide.ts'
import type { TableSchemaMap } from '../value-objects'
import type { IQueryRecordSchema } from './record.type'
import type { IRecordSpec } from './specifications'

export interface IRecordQueryModel {
  findOne(spec: IRecordSpec, schema: TableSchemaMap): Promise<Option<IQueryRecordSchema>>
  findOneById(id: string, schema: TableSchemaMap): Promise<Option<IQueryRecordSchema>>
  find(spec: IRecordSpec, schema: TableSchemaMap): Promise<IQueryRecordSchema[]>
}
