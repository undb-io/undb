import type { Option } from 'oxide.ts'
import type { ReferenceFieldTypes } from '../field/field.type.js'
import type { Table } from '../table.js'
import type { ViewId } from '../view/index.js'
import type { IQueryRecords, IQueryRecordSchema } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordQueryModel {
  findOne(table: Table, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>>
  findOneById(table: Table, id: string): Promise<Option<IQueryRecordSchema>>
  find(table: Table, viewId: ViewId | undefined, spec: IRecordSpec): Promise<IQueryRecords>
  findForiegn(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec,
    field: ReferenceFieldTypes,
  ): Promise<IQueryRecords>
}
