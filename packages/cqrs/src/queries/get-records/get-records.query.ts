import type { IRootFilter } from '@undb/core'
import { Query } from '@undb/domain'
import type { IGetRecordsQuery } from './get-records.query.interface.js'

export class GetRecordsQuery extends Query implements IGetRecordsQuery {
  readonly tableId: string
  readonly filter?: IRootFilter
  readonly viewId?: string
  readonly q?: string

  constructor(query: IGetRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.filter = query.filter
    this.viewId = query.viewId
    this.q = query.q
  }
}
