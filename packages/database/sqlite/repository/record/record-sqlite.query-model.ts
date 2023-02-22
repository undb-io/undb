import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  Table,
  ViewId,
} from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(
    table: Table,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
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

    const builder = new RecordSqliteQueryBuilder(knex, table, spec)
    const qb = builder.select().from().where().reference().build()

    const data = await this.em.execute<RecordSqlite[]>(qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(table: Table, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(table, WithRecordId.fromString(id))
  }
}
