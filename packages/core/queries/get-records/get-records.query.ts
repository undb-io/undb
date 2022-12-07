import { Query } from '@egodb/domain'
import type { IGetRecordsQuery } from './get-records.query.interface'

export class GetRecordsQuery extends Query {
  readonly tableId: string
  constructor(query: IGetRecordsQuery) {
    super()
    this.tableId = query.tableId
  }
}
