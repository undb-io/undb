import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, TableSchemaIdMap, TreeField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'
import type { RecordSqliteWithParent } from './record.type'
import { createRecordTree } from './record.util'

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
      .from(tableId)
      .leftOuterJoin(closureTable.name, function () {
        this
          //
          .on(`${tableId}.${INTERNAL_COLUMN_ID_NAME}`, '=', `${closureTable.name}.${ClosureTable.CHILD_ID}`)
          .andOn(`${closureTable.name}.${ClosureTable.DEPTH}`, '=', knex.raw('?', [1]))
      })
      .select([...columns.map((c) => c.name), `${closureTable.name}.${ClosureTable.PARENT_ID}`])

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()
    const data = await this.em.execute<RecordSqliteWithParent[]>(qb)
    const records = data.map((r) => {
      const record = RecordSqliteMapper.toQuery(tableId, schema, r)
      return { ...r, ...record }
    })

    const tree = createRecordTree(records)

    return tree
  }
}
