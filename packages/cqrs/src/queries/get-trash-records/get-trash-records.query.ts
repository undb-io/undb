import type { IRootFilter } from '@undb/core'
import { IPagination, Query } from '@undb/domain'
import type { IGetTrashRecordsQuery } from './get-trash-records.query.interface.js'

export class GetTrashRecordsQuery extends Query implements IGetTrashRecordsQuery {
  readonly tableId: string
  readonly filter?: IRootFilter
  readonly q?: string
  readonly pagination?: IPagination

  constructor(query: IGetTrashRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.filter = query.filter
    this.q = query.q
    this.pagination = query.pagination
  }
}
