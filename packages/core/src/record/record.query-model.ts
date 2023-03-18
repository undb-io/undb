import type { Option } from 'oxide.ts'
import type { ReferenceFieldTypes } from '../field/field.type.js'
import type { ViewId } from '../view/index.js'
import type { IQueryRecords, IQueryRecordSchema } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordQueryModel {
  findOne(tableId: string, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>>
  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>>
  find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<IQueryRecords>
  findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<{ records: IQueryRecords; total: number }>
}
