import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  ReferenceFieldTypes,
  ViewId,
} from '@egodb/core'
import { WithRecordId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { Option } from 'oxide.ts'
import { Table as TableEntity } from '../../entity/table.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { INTERNAL_COLUMN_NAME_TOTAL } from './record.constants.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  protected readonly em: EntityManager
  constructor(em: EntityManager) {
    this.em = em.fork()
  }

  async find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<IQueryRecords> {
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      { populate: ['fields.displayFields'] },
    )
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    builder = builder.select().from().where().looking().sort().expand(referenceField).build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    return RecordSqliteMapper.toQueries(tableId, schema, data)
  }

  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    referenceField?: ReferenceFieldTypes,
  ): Promise<{ records: IQueryRecords; total: number }> {
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      { populate: ['fields.displayFields'], populateWhere: { fields: { deletedAt: null } } },
    )
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    builder = builder.select().from().where().looking().sort().expand(referenceField).build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    const tb = builder.clone().from().where().count().build()
    const td = await this.em.execute<{ total: number }[]>(tb.qb.first())

    const records = RecordSqliteMapper.toQueries(tableId, schema, data)
    const total = td[0]?.[INTERNAL_COLUMN_NAME_TOTAL]

    return { records, total: total }
  }

  async findOne(tableId: string, spec: IRecordSpec): Promise<Option<IQueryRecordSchema>> {
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      { populate: ['fields.displayFields'] },
    )
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
    builder = builder.select().from().where().looking().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb.first())

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(tableId, WithRecordId.fromString(id))
  }
}
