import type { IQueryRecordSchema, IRecordQueryModel, IRecordSpec, QueryRecords, TableSchemaMap } from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: IRecordSpec, schema: TableSchemaMap): Promise<QueryRecords> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(qb)
    spec.accept(visitor).unwrap()

    const data = await qb

    const records = data.map((d) => RecordSqliteMapper.toQuery(visitor.tableId, schema, d))
    return records
  }

  async findOne(spec: IRecordSpec, schema: TableSchemaMap): Promise<Option<IQueryRecordSchema>> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(qb)
    spec.accept(visitor).unwrap()

    const data = await qb.first()

    const record = RecordSqliteMapper.toQuery(visitor.tableId, schema, data)
    return Option(record)
  }

  findOneById(id: string, schema: TableSchemaMap): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(WithRecordId.fromString(id), schema)
  }
}
