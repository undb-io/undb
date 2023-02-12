import type { TreeField } from '../field/index.js'
import type { TableSchemaIdMap } from '../value-objects/index.js'
import type { IQueryTreeRecords } from './record.type.js'
import type { IRecordSpec } from './specifications/index.js'

export interface IRecordTreeQueryModel {
  /**
   * returns root categories with sub categories inside
   * @param tableId - tableId
   * @param field - tree field
   * @param spec - spec
   * @param schema - schema
   */
  findTrees(tableId: string, field: TreeField, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryTreeRecords>
}
