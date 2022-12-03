import type { Option } from 'oxide.ts'
import type { IQueryRecordSchema } from './record.type'
import type { IRecordSpec } from './specifications'

export interface IRecordQueryModel {
  findOne(spec: IRecordSpec): Promise<Option<IQueryRecordSchema>>
  findOneById(id: string): Promise<Option<IQueryRecordSchema>>
  find(): Promise<IQueryRecordSchema[]>
}
