import type { ChartVirsualization, IChartData, VirsualizationVO } from '../virsualization/index.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordAggregateRepository {
  number(tableId: string, virsualization: VirsualizationVO, spec: IRecordSpec | null): Promise<number>
  chart(tableId: string, virsualization: ChartVirsualization, spec: IRecordSpec | null): Promise<IChartData>
}
