import { Query } from '@undb/domain'
import type { IGetShareAggregateNumberQuery } from './get-share-aggregate-number.query.interface.js'

export class GetShareAggregateNumberQuery extends Query {
  public readonly viewId: string
  public readonly visualizationId: string

  constructor(query: IGetShareAggregateNumberQuery) {
    super()
    this.viewId = query.viewId
    this.visualizationId = query.visualizationId
  }
}
