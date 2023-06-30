import { Query } from '@undb/domain'
import type { IGetShareAggregateChartQuery } from './get-share-aggregate-chart.query.interface.js'

export class GetShareAggregateChartQuery extends Query {
  public readonly viewId: string
  public readonly visualizationId: string

  constructor(query: IGetShareAggregateChartQuery) {
    super()
    this.viewId = query.viewId
    this.visualizationId = query.visualizationId
  }
}
