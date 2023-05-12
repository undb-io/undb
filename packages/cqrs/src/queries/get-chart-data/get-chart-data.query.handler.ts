import { ChartVirsualization, type IRecordAggregateRepository, type ITableRepository } from '@undb/core'
import type { IQueryHandler } from '@undb/domain'
import type { IGetChartDataOutput } from './get-chart-data.query.interface.js'
import type { GetChartDataQuery } from './get-chart-data.query.js'

export class GetChartDataQueryHandler implements IQueryHandler<GetChartDataQuery, IGetChartDataOutput> {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly repo: IRecordAggregateRepository) {}

  async execute(query: GetChartDataQuery): Promise<IGetChartDataOutput> {
    const table = (await this.tableRepo.findOneById(query.tableId)).unwrap()
    const view = table.mustGetView(query.viewId)
    const virsualization = view.mustGetVirsualization(query.virsualizationId)

    if (!(virsualization instanceof ChartVirsualization)) throw new Error('invalid chart virsualizatio')

    const data = await this.repo.chart(query.tableId, virsualization, null)

    return { data }
  }
}
