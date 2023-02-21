import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  Table,
  ViewId,
} from '@egodb/core'
import { getReferenceFields, WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { TABLE_ALIAS } from './record.constants.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec,
    referenceField?: ReferenceFieldTypes,
  ): Promise<IQueryRecords> {
    const tableId = table.id.value
    const schema = table.schema.toIdMap()
    const knex = this.em.getKnex()

    const builder = new RecordSqliteQueryBuilder(knex, table, spec, viewId?.value)
    const qb = builder.select().from().where().reference().sort().expand(referenceField).build()

    const data = await this.em.execute<RecordSqlite[]>(qb)

    return RecordSqliteMapper.toQueries(tableId, schema, data)
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
