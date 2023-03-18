import type { TreeField } from '../field/index.js'
import type { IQueryTreeRecords } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordTreeQueryModel {
  findTrees(tableId: string, field: TreeField, spec: IRecordSpec): Promise<IQueryTreeRecords>
}
