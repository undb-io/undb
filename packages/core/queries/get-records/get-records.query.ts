import { Query } from '@egodb/domain'
import type { IGetRecordsQuery } from './get-records.query.interface'

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  readonly tableId: string
  readonly viewKey?: string
  constructor(query: IGetRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.viewKey = query.viewKey
  }
}
