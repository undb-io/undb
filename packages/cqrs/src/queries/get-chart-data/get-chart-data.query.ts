import { Query } from '@undb/domain'
import type { IGetChartDataQuery } from './get-chart-data.query.interface.js'

export class GetChartDataQuery extends Query {
  public readonly tableId: string
  public readonly viewId: string
  public readonly visualizationId: string

  constructor(query: IGetChartDataQuery) {
    super()
    this.tableId = query.tableId
    this.viewId = query.viewId
    this.visualizationId = query.visualizationId
  }
}
