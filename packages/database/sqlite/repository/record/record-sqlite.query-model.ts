import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  Table,
  TableSchemaIdMap,
  View,
  ViewId,
} from '@egodb/core'
import { getReferenceFields, WithRecordId } from '@egodb/core'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'
import type { RecordSqlite } from './record.type.js'
import { expandField } from './record.util.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  #buildQuery(
    knex: Knex,
    qb: Knex.QueryBuilder,
    tableId: string,
    schema: TableSchemaIdMap,
    view: View,
    spec: IRecordSpec,
  ) {
    const alias = TABLE_ALIAS

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const referenceFields = getReferenceFields([...schema.values()])
    for (const [index, referenceField] of referenceFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(tableId, index, qb, knex)
      referenceField.accept(visitor)
    }

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => `${alias}.${c.name}`))

    const sorts = view.sorts?.sorts ?? []
    if (sorts.length) {
      for (const sort of sorts) {
        const field = schema.get(sort.fieldId)
        if (!field) continue

        const column = UnderlyingColumnFactory.create(field)
        if (Array.isArray(column)) {
          for (const c of column) {
            qb.orderBy(`${alias}.${c.name}`, sort.direction)
          }
        } else {
          qb.orderBy(`${alias}.${column.name}`, sort.direction)
        }
      }
    }
  }

  async find(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec,
    referenceField?: ReferenceFieldTypes,
  ): Promise<IQueryRecords> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()
    const view = table.mustGetView(viewId?.value)
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    this.#buildQuery(knex, qb, tableId, schema, view, spec)
    if (referenceField) {
      expandField(referenceField, TABLE_ALIAS, knex, qb, true)
    }

    const data = await this.em.execute<RecordSqlite[]>(qb)

    const records = data.map((d) => RecordSqliteMapper.toQuery(tableId, schema, d))
    return records
  }

  async findOne(table: Table, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const referenceFields = getReferenceFields([...schema.values()])
    for (const [index, referenceField] of referenceFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(tableId, index, qb, knex)
      referenceField.accept(visitor)
    }

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => `${TABLE_ALIAS}.${c.name}`))

    const data = await this.em.execute<RecordSqlite[]>(qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(table: Table, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(table, WithRecordId.fromString(id))
  }
}
