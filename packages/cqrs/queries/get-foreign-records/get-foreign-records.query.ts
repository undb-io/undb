import { Query } from '@egodb/domain'
import type { IGetForeignRecordsQuery } from './get-foreign-records.query.interface.js'

export class GetForeignRecordsQuery extends Query implements IGetForeignRecordsQuery {
  readonly tableId: string
  readonly foreignTableId: string
  readonly fieldId: string
  readonly viewId?: string
  constructor(query: IGetForeignRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.foreignTableId = query.foreignTableId
    this.fieldId = query.fieldId
    this.viewId = query.viewId
  }
}
