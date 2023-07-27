import type { IRootFilter } from '@undb/core'
import { Query } from '@undb/domain'
import type { IGetTrashRecordsQuery } from './get-trash-records.query.interface.js'

export class GetTrashRecordsQuery extends Query implements IGetTrashRecordsQuery {
  readonly tableId: string
  readonly filter?: IRootFilter
  readonly q?: string

  constructor(query: IGetTrashRecordsQuery) {
    super()
    this.tableId = query.tableId
    this.filter = query.filter
    this.q = query.q
  }
}
