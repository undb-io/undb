import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, TableSchemaIdMap } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'

export class RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(private readonly em: EntityManager) {}

  async findTrees(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryTreeRecords> {
    throw new Error('Method not implemented.')
  }
}
