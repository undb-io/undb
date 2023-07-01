import { Query } from '@undb/domain'
import type { IGetShareViewTreeRecordsQuery } from './get-share-view-tree-records.query.interface.js'

export class GetShareViewTreeRecordsQuery extends Query implements IGetShareViewTreeRecordsQuery {
  readonly viewId: string
  readonly fieldId: string
  constructor(query: IGetShareViewTreeRecordsQuery) {
    super()
    this.viewId = query.viewId
    this.fieldId = query.fieldId
  }
}
