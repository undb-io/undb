import { Query } from '@egodb/domain'
import type { IRootFilter } from '../../filter/index.js'
import type { IGetRecordsQuery } from './get-records.query.interface.js'

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  readonly tableId: string
  readonly filter?: IRootFilter
  readonly viewKey?: string
  constructor(query: IGetRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.filter = query.filter
    this.viewKey = query.viewKey
  }
}
