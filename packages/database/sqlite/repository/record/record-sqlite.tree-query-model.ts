import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, TableSchemaIdMap, TreeField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(private readonly em: EntityManager) {}

  async findTrees(
    tableId: string,
    field: TreeField,
    spec: IRecordSpec,
    schema: TableSchemaIdMap,
  ): Promise<IQueryTreeRecords> {
    const knex = this.em.getKnex()

    const closureTable = new ClosureTable(tableId, field)
    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    const qb = knex
      .queryBuilder()
      .join(closureTable.name, `${tableId}.${INTERNAL_COLUMN_ID_NAME}`, `${closureTable.name}.${ClosureTable.CHILD_ID}`)
      .where(`${closureTable.name}.${ClosureTable.DEPTH}`, 1)
      .select([
        ...columns.map((c) => c.name),
        `${closureTable.name}.${ClosureTable.CHILD_ID} as ${closureTable.name}_${ClosureTable.CHILD_ID}`,
      ])

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()
    const data = await this.em.execute(qb)

    console.log(data)

    throw new Error('unimplemented')
  }
}
