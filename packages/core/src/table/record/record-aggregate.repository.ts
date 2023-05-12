import type { ChartVirsualization, VirsualizationVO } from '../virsualization'
import type { IRecordSpec } from './specifications'

export interface IRecordAggregateRepository {
  number(tableId: string, virsualization: VirsualizationVO, spec: IRecordSpec | null): Promise<number>
  chart(
    tableId: string,
    virsualization: ChartVirsualization,
    spec: IRecordSpec | null,
  ): Promise<{ key: string; value: number }[]>
}
