import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, Table, TreeField } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { DELETED_AT_COLUMN_NAME } from '../../decorators/soft-delete.decorator.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'
import type { RecordSqliteWithParent } from './record.type.js'
import { createRecordTree, expandField } from './record.util.js'

export class RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(private readonly em: EntityManager) {}

  async findTrees(table: Table, field: TreeField, spec: IRecordSpec): Promise<IQueryTreeRecords> {
    const em = this.em.fork()
    const knex = em.getKnex()
    const tableId = table.id.value
    const schema = table.schema.toIdMap()

    const closureTable = new ClosureTable(tableId, field)
    const columns = UnderlyingColumnFactory.createMany(table.schema.fields, tableId)

    const alias = TABLE_ALIAS

    const qb = knex
      .queryBuilder()
      .from(`${tableId} as ${alias}`)
      .leftOuterJoin(`${closureTable.name} as c`, function () {
        this
          //
          .on(`${alias}.${INTERNAL_COLUMN_ID_NAME}`, '=', `c.${ClosureTable.CHILD_ID}`)
          .andOn(`c.${ClosureTable.DEPTH}`, '=', knex.raw('?', [1]))
      })
      .leftOuterJoin(`${tableId} as t2`, `t2.${INTERNAL_COLUMN_ID_NAME}`, `c.${ClosureTable.PARENT_ID}`)
      .whereNull(`t2.${DELETED_AT_COLUMN_NAME}`)
      .select([...columns.map((c) => `t.${c.name}`), `c.${ClosureTable.PARENT_ID}`])

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const lookingFields = table.schema.getLookingFields()
    for (const [index, lookingField] of lookingFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(tableId, index, qb, knex)
      lookingField.accept(visitor)
      await expandField(lookingField, alias, em, knex, qb)
    }

    const data = await em.execute<RecordSqliteWithParent[]>(qb)
    const records = data.map((r) => {
      const record = RecordSqliteMapper.toQuery(tableId, schema, r)
      return { ...r, ...record }
    })

    return createRecordTree(records)
  }
}
