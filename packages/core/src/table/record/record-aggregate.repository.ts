import type { VirsualizationVO } from '../virsualization'
import type { IRecordSpec } from './specifications'

export interface IRecordAggregateRepository {
  number(tableId: string, virsualization: VirsualizationVO, spec: IRecordSpec | null): Promise<number>
}
