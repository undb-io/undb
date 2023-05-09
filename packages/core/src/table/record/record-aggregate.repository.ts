import type { IRecordSpec } from './specifications'

export interface IRecordAggregateRepository {
  number(tableId: string, spec: IRecordSpec | null): Promise<number>
}
