import type { IQueryRecords, IQueryRecordSchema, IRecordQueryModel, IRecordSpec, TableSchemaIdMap } from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { getColumnNames } from '../../underlying-table/underlying-table.utils'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryRecords> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(qb)
    spec.accept(visitor).unwrap()

    qb.select(getColumnNames([...schema.values()]))

    const data = await this.em.execute(qb)

    const records = data.map((d) => RecordSqliteMapper.toQuery(visitor.tableId, schema, d))
    return records
  }

  async findOne(spec: IRecordSpec, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()

    const visitor = new RecordSqliteQueryVisitor(qb)
    spec.accept(visitor).unwrap()

    qb.select(getColumnNames([...schema.values()]))

    const data = await this.em.execute(qb.first())

    const record = RecordSqliteMapper.toQuery(visitor.tableId, schema, data)
    return Option(record)
  }

  findOneById(id: string, schema: TableSchemaIdMap): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(WithRecordId.fromString(id), schema)
  }

  findTreeAvailable(spec: IRecordSpec, schema: TableSchemaIdMap): Promise<IQueryRecords> {
    throw new Error('Method not implemented.')
  }
}
