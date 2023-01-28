import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ISorts,
  TableSchemaIdMap,
} from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'
import type { RecordSqlite } from './record.type'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap, sorts: ISorts): Promise<IQueryRecords> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => c.name))
    if (sorts.length) {
      for (const sort of sorts) {
        const field = schema.get(sort.fieldId)
        if (!field) continue

        const column = UnderlyingColumnFactory.create(field)
        if (Array.isArray(column)) continue

        qb.orderBy(column.name, sort.direction)
      }
    }

    const data = await this.em.execute<RecordSqlite[]>(qb)

    const records = data.map((d) => RecordSqliteMapper.toQuery(tableId, schema, d))
    return records
  }

  async findOne(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(tableId, schema, qb, knex)
    spec.accept(visitor).unwrap()
    const columns = UnderlyingColumnFactory.createMany([...schema.values()])

    qb.select(columns.map((c) => c.name))

    const data = await this.em.execute<RecordSqlite>(qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data)
    return Option(record)
  }

  findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(tableId, WithRecordId.fromString(id), schema)
  }
}
