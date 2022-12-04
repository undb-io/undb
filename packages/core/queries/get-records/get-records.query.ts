import { Query } from '@egodb/domain/dist'
import type { IGetRecordsQuery } from './get-records.query.interface'

export class GetRecordsQuery extends Query {
  readonly tableId: string
  constructor(query: IGetRecordsQuery) {
    super()
    this.tableId = query.tableId
  }
}
