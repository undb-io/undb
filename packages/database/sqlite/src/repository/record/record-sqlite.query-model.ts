import { type EntityManager } from '@mikro-orm/better-sqlite'
import type {
  IQueryRecords,
  IQueryRecordSchema,
  IRecordQueryModel,
  IRecordSpec,
  RecordsWithCount,
  TrashRecordsWithCount,
  ViewId,
} from '@undb/core'
import { WithRecordId, WithRecordTableId } from '@undb/core'
import type { IRepositoryOption } from '@undb/domain'
import { None, Option } from 'oxide.ts'
import { ReferenceField, SelectField } from '../../entity/field.js'
import { Table as TableEntity } from '../../entity/table.js'
import {
  INTERNAL_COLUMN_DELETED_AT_NAME,
  INTERNAL_COLUMN_DELETED_BY_NAME,
  INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME,
} from '../../underlying-table/constants.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { TABLE_ALIAS } from './record.constants.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteQueryModel implements IRecordQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async #getTable(tableId: string): Promise<TableEntity> {
    const tableEntity = await this.em.findOneOrFail(
      TableEntity,
      { id: tableId },
      {
        populate: [
          'fields',
          'views',
          'forms',
          'fields.options',
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
          'views.widgets.visualization',
        ],
      },
    )
    for (const field of tableEntity.fields) {
      if (field instanceof ReferenceField) {
        if (!field.foreignTable?.fields.isInitialized()) {
          await field.foreignTable?.fields.init()
        }
        const displayFields = field.displayFields.getItems(false) ?? []
        for (const f of displayFields) {
          if (f instanceof SelectField) {
            await f.options.init()
          }
        }
      }
    }

    return tableEntity
  }

  async find(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<IQueryRecords> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    // TODO: expand reference field
    builder = builder
      .select()
      .from()
      .where()
      .reference()
      .sort()
      .pagination(option?.pagination)
      .build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    return RecordSqliteMapper.toQueries(tableId, schema, data)
  }

  async findAndCount(
    tableId: string,
    viewId: ViewId | undefined,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<RecordsWithCount> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec, viewId?.value)
    builder = builder.from().where().build()

    const data = await this.em.execute<RecordSqlite[]>(
      builder
        .clone()
        .select()
        .reference()
        .sort()
        .pagination(option?.pagination)
        .build().qb,
    )
    const count = await this.em.execute(builder.clone().count().build().qb.first())

    const records = RecordSqliteMapper.toQueries(tableId, schema, data)
    const total = count.at(0)?.['count(*)']

    return { records, total: total }
  }

  async findDeletedAndCount(
    tableId: string,
    spec: IRecordSpec | null,
    option?: IRepositoryOption,
  ): Promise<TrashRecordsWithCount> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
    builder = builder.from().where(true).build()
    builder.qb
      .whereNotNull(`${TABLE_ALIAS}.${INTERNAL_COLUMN_DELETED_AT_NAME}`)
      .orderBy(`${TABLE_ALIAS}.${INTERNAL_COLUMN_DELETED_AT_NAME}`, 'desc')

    const data = await this.em.execute<RecordSqlite[]>(
      builder
        .clone()
        .select(
          INTERNAL_COLUMN_DELETED_AT_NAME,
          INTERNAL_COLUMN_DELETED_BY_NAME,
          INTERNAL_COLUMN_DELETED_BY_PROFILE_NAME,
        )
        .reference()
        .sort()
        .pagination(option?.pagination)
        .build().qb,
    )
    const count = await this.em.execute(builder.clone().build().qb.count().first())

    const records = RecordSqliteMapper.toTrashes(tableId, schema, data)
    const total = count.at(0)?.['count(*)']

    return { records, total: total }
  }

  async findOne(tableId: string, spec: IRecordSpec | null): Promise<Option<IQueryRecordSchema>> {
    const tableEntity = await this.#getTable(tableId)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const schema = table.schema.toIdMap()

    spec = spec
      ? WithRecordTableId.fromString(tableId).unwrap().and(spec)
      : WithRecordTableId.fromString(tableId).unwrap()

    let builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec)
    builder = builder.select().from().where().reference().build()

    const data = await this.em.execute<RecordSqlite[]>(builder.qb.first())
    if (!data.length) {
      return None
    }

    const record = RecordSqliteMapper.toQuery(tableId, schema, data[0])
    return Option(record)
  }

  findOneById(tableId: string, id: string): Promise<Option<IQueryRecordSchema>> {
    return this.findOne(tableId, WithRecordId.fromString(id))
  }
}
