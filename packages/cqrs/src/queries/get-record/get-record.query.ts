import { Query } from '@undb/domain'
import type { IGetRecordQuery } from './get-record.query.interface.js'

export class GetRecordQuery extends Query implements IGetRecordQuery {
  readonly tableId: string
  readonly id: string
  constructor(query: IGetRecordQuery) {
    super()
    this.tableId = query.tableId
    this.id = query.id
  }
}
