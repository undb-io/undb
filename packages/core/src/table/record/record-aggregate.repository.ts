import type { ChartVisualization, IChartData, VisualizationVO } from '../visualization/index.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordAggregateRepository {
  number(tableId: string, visualization: VisualizationVO, spec: IRecordSpec | null): Promise<number>
  chart(tableId: string, visualization: ChartVisualization, spec: IRecordSpec | null): Promise<IChartData>
}
