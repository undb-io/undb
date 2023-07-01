import {
  ChartVisualization,
  TableFactory,
  WithTableViewId,
  type IRecordAggregateRepository,
  type ITableQueryModel,
} from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IShareGuardService } from '@undb/integrations'
import { WithShareView } from '@undb/integrations'
import type { IGetShareAggregateChartOutput } from './get-share-aggregate-chart.query.interface.js'
import type { GetShareAggregateChartQuery } from './get-share-aggregate-chart.query.js'

export class GetShareAggregateChartQueryHandler
  implements IQueryHandler<GetShareAggregateChartQuery, IGetShareAggregateChartOutput>
{
  constructor(
    protected readonly guard: IShareGuardService,
    protected readonly tableQueryModel: ITableQueryModel,
    protected readonly repo: IRecordAggregateRepository,
  ) {}

  async execute(query: GetShareAggregateChartQuery): Promise<IGetShareAggregateChartOutput> {
    await this.guard.verify(new WithShareView(query.viewId))

    const table = (await this.tableQueryModel.findOne(WithTableViewId.fromString(query.viewId))).unwrap()
    const tb = TableFactory.fromQuery(table)
    const view = tb.mustGetView(query.viewId)
    const visualization = view.mustGetVisualization(query.visualizationId)

    if (!(visualization instanceof ChartVisualization)) throw new Error('invalid chart virsualizatio')

    const data = await this.repo.chart(table.id, visualization, null)

    return {
      data,
    }
  }
}
