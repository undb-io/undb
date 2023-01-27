import type { TableSchemaIdMap } from '../value-objects'
import type { IQueryTreeRecords } from './record.type'
import type { IRecordSpec } from './specifications'

export interface IRecordTreeQueryModel {
  /**
   * returns root categories with sub categories inside
   * @param tableId - tableId
   * @param spec - spec
   * @param schema - schema
   */
  findTrees(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryTreeRecords>
}
