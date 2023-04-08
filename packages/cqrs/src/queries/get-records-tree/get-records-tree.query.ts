import { Query } from '@undb/domain'
import type { IGetRecordsTreeQuery } from './get-records-tree.query.interface.js'

export class GetRecordsTreeQuery extends Query implements IGetRecordsTreeQuery {
  readonly tableId: string
  readonly fieldId: string
  readonly viewId?: string
  constructor(query: IGetRecordsTreeQuery) {
    super()
    this.tableId = query.tableId
    this.fieldId = query.fieldId
    this.viewId = query.viewId
  }
}
