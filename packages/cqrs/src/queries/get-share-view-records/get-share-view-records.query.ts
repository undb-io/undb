import { Query } from '@undb/domain'
import type { IGetShareViewRecordsQuery } from './get-share-view-records.query.interface.js'

export class GetShareViewRecordsQuery extends Query implements IGetShareViewRecordsQuery {
  readonly viewId: string
  constructor(query: IGetShareViewRecordsQuery) {
    super()
    this.viewId = query.viewId
  }
}
