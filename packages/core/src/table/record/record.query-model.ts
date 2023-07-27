import type { Option } from 'oxide.ts'
import type { ViewId } from '../view/index.js'
import type { IQueryRecords, IQueryRecordSchema } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export type RecordsWithCount = { records: IQueryRecords; total: number }

export interface IRecordQueryModel {
  findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>>
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>>
  find(tableId: string, viewId: ViewId | undefined, spec: IRecordSpec | null): Promise<IQueryRecords>
  findAndCount(tableId: string, viewId: ViewId | undefined, spec: IRecordSpec | null): Promise<RecordsWithCount>

  findDeletedAndCount(tableId: string, spec: IRecordSpec | null): Promise<RecordsWithCount>
}
