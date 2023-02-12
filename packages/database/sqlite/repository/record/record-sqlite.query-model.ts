import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ISorts,
  TableSchemaIdMap,
} from '@egodb/core'
import { getReferenceFields, WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap, sorts: ISorts): Promise<IQueryRecords> {
    const knex = this.em.getKnex()
    const alias = 't'
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(tableId, alias, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const referenceFields = getReferenceFields([...schema.values()])
    for (const [index, referenceField] of referenceFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(tableId, alias, index, qb, knex)
      referenceField.accept(visitor)
    }

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => `${alias}.${c.name}`))
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

    const data = await this.em.execute<RecordSqlite[]>(qb)

    const records = data.map((d) => RecordSqliteMapper.toQuery(tableId, schema, d))
    return records
  }

  async findOne(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    const knex = this.em.getKnex()
    const alias = 't'
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(tableId, alias, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const referenceFields = getReferenceFields([...schema.values()])
    for (const [index, referenceField] of referenceFields.entries()) {
      const visitor = new RecordSqliteReferenceQueryVisitor(tableId, alias, index, qb, knex)
      referenceField.accept(visitor)
    }

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => `${alias}.${c.name}`))

    const data = await this.em.execute<RecordSqlite[]>(qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(tableId, WithRecordId.fromString(id), schema)
  }
}
