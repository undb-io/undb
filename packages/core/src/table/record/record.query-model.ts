import { IRepositoryOption } from '@undb/domain'
import type { Option } from 'oxide.ts'
import type { ViewId } from '../view/index.js'
import type { IQueryRecords, IQueryRecordSchema, ITrashRecordSchema } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export type RecordsWithCount = { records: IQueryRecords; total: number }
export type TrashRecordsWithCount = { records: ITrashRecordSchema[]; total: number }

export interface IRecordQueryModel {
  findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>>
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>>
  find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<IQueryRecords>
  findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<RecordsWithCount>

  findDeletedAndCount(
    tableId: string,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<TrashRecordsWithCount>
}
