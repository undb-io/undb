import { Query } from '@undb/domain'
import type { IGetShareViewRecordQuery } from './get-share-view-record.query.interface.js'

export class GetShareViewRecordQuery extends Query implements IGetShareViewRecordQuery {
  readonly viewId: string
  readonly id: string
  constructor(query: IGetShareViewRecordQuery) {
    super()
    this.viewId = query.viewId
    this.id = query.id
  }
}
