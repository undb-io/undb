import type { IRootFilter } from '@undb/core'
import { Query } from '@undb/domain'
import type { IGetShareViewRecordsQuery } from './get-share-view-records.query.interface.js'

export class GetShareViewRecordsQuery extends Query implements IGetShareViewRecordsQuery {
  readonly viewId: string
  readonly filter?: IRootFilter
  readonly q?: string
  constructor(query: IGetShareViewRecordsQuery) {
    super()
    this.viewId = query.viewId
    this.filter = query.filter
    this.q = query.q
  }
}
