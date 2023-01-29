import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, TableSchemaIdMap, TreeField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { DELETED_AT_COLUMN_NAME } from '../../decorators/soft-delete.decorator'
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
      .from(`${tableId} as t`)
      .leftOuterJoin(`${closureTable.name} as c`, function () {
        this
          //
          .on(`t.${INTERNAL_COLUMN_ID_NAME}`, '=', `c.${ClosureTable.CHILD_ID}`)
          .andOn(`c.${ClosureTable.DEPTH}`, '=', knex.raw('?', [1]))
      })
      .leftOuterJoin(`${tableId} as t2`, `t2.${INTERNAL_COLUMN_ID_NAME}`, `c.${ClosureTable.PARENT_ID}`)
      .whereNull(`t2.${DELETED_AT_COLUMN_NAME}`)
      .select([...columns.map((c) => `t.${c.name}`), `c.${ClosureTable.PARENT_ID}`])

    const visitor = new RecordSqliteQueryVisitor(tableId, 't', schema, qb, knex)
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
