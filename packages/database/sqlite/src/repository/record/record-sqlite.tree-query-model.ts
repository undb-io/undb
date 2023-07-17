import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryTreeRecords, IRecordSpec, IRecordTreeQueryModel, TreeField } from '@undb/core'
import { INTERNAL_COLUMN_ID_NAME } from '@undb/core'
import { DELETED_AT_COLUMN_NAME } from '../../decorators/soft-delete.decorator.js'
import { ReferenceField } from '../../entity/field.js'
import { Table as TableEntity } from '../../entity/table.js'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { ClosureTable } from '../../underlying-table/underlying-foreign-table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'
import type { RecordSqliteWithParent } from './record.type.js'
import { createRecordTree } from './record.util.js'

export class RecordSqliteTreeQueryModel implements IRecordTreeQueryModel {
  constructor(private readonly em: EntityManager) {}

  async findTrees(tableId: string, field: TreeField, spec: IRecordSpec): Promise<IQueryTreeRecords> {
    const em = this.em
    const knex = em.getKnex()
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      {
        populate: [
          'fields',
          'views',
          'forms',
          'fields.displayFields',
          'fields.countFields',
          'fields.minFields',
          'fields.minAggregateField',
          'fields.maxFields',
          'fields.maxAggregateField',
          'fields.sumFields',
          'fields.sumAggregateField',
          'fields.averageFields',
          'fields.averageAggregateField',
          'fields.lookupFields',
          'fields.foreignTable',
        ],
      },
    )
    for (const field of tableEntity.fields) {
      if (field instanceof ReferenceField) {
        await field.foreignTable?.fields.init({ where: { display: true } })
      }
    }

    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
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
      .leftJoin(`${tableId} as t2`, `t2.${INTERNAL_COLUMN_ID_NAME}`, `c.${ClosureTable.PARENT_ID}`)
      .whereNull(`t2.${DELETED_AT_COLUMN_NAME}`)
      .select([...columns.filter((c) => !c.virtual).map((c) => `t.${c.name}`), `c.${ClosureTable.PARENT_ID}`])

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, this.em, qb, knex)
    spec.accept(visitor).unwrap()

    new RecordSqliteReferenceQueryVisitor(em, knex, qb, table, tableEntity).visit(table)

    const data = await em.execute<RecordSqliteWithParent[]>(qb)
    const records = data.map((r) => {
      const record = RecordSqliteMapper.toQuery(tableId, schema, r)
      return { ...r, ...record }
    })

    return createRecordTree(records)
  }
}
