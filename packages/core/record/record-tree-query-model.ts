import type { TreeField } from '../field/index.js'
import type { Table } from '../table.js'
import type { IQueryTreeRecords } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordTreeQueryModel {
  findTrees(table: Table, field: TreeField, spec: IRecordSpec): Promise<IQueryTreeRecords>
}
