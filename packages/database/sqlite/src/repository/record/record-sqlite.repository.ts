import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { LockMode } from '@mikro-orm/core'
import type {
  ClsStore,
  Record as CoreRecord,
  Table as CoreTable,
  IClsService,
  IRecordRepository,
  IRecordSpec,
  Record,
  TableSchemaIdMap,
} from '@undb/core'
import {
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  ParentField,
  RecordBulkCreatedEvent,
  RecordBulkDeletedEvent,
  RecordBulkUpdatedEvent,
  RecordCreatedEvent,
  RecordDeletedEvent,
  RecordRestoredEvent,
  RecordUpdatedEvent,
  TreeField,
  TreeFieldValue,
  WithRecordId,
  WithRecordIds,
  WithRecordTableId,
  WithRecordValues,
} from '@undb/core'
import { and, type IUnitOfWork } from '@undb/domain'
import { chunk } from 'lodash-es'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import pMap from 'p-map'
import { ReferenceField, SelectField } from '../../entity/field.js'
import { Table } from '../../entity/table.js'
import { type IOutboxService } from '../../services/outbox.service.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME, INTERNAL_COLUMN_DELETED_BY_NAME } from '../../underlying-table/constants.js'
import { UnderlyingTableSqliteManager } from '../../underlying-table/underlying-table-sqlite.manager.js'
import type { Job } from '../base-entity-manager.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(
    protected readonly uow: IUnitOfWork<EntityManager>,
    protected readonly cls: IClsService<ClsStore>,
    protected readonly outboxService: IOutboxService,
  ) {}

  private get em() {
    return this.uow.conn()
  }

  private async _insert(em: EntityManager, record: CoreRecord, schema: TableSchemaIdMap) {
    const userId = this.cls.get('user.userId')
    const data: globalThis.Record<string, Knex.Value> = {
      id: record.id.value,
      [INTERNAL_COLUMN_CREATED_BY_NAME]: userId,
      [INTERNAL_COLUMN_UPDATED_BY_NAME]: userId,
    }
    const queries: string[] = []
    const jobs: Job[] = []

    for (const [fieldId, field] of schema) {
      // Tree field value 需要在 closure table 设置初始记录
      if (field instanceof TreeField && !record.values.value.get(fieldId)) {
        record.values.value.set(fieldId, new TreeFieldValue([]))
      }
    }

    for (const [fieldId, value] of record.values) {
      const visitor = new RecordValueSqliteMutationVisitor(
        this.cls,
        record.tableId.value,
        fieldId,
        record.id.value,
        true,
        schema,
        em,
      )

      value.accept(visitor)

      Object.assign(data, visitor.data)
      queries.push(...visitor.queries)
      jobs.push(...visitor.jobs)
    }

    const qb = em.getKnex().insert(data).into(record.tableId.value)
    await em.execute(qb)
    await Promise.all(queries.map((query) => em.execute(query)))
    await Promise.all(jobs.map((job) => job()))
  }

  async insert(table: CoreTable, record: CoreRecord): Promise<void> {
    const userId = this.cls.get('user.userId')

    await this.uow.begin()
    const em = this.em

    const schema = table.schema.toIdMap()

    try {
      await this._insert(em, record, schema)
      const spec = WithRecordTableId.fromString(table.id.value).unwrap().and(WithRecordId.fromString(record.id.value))
      const found = await this.findOneRecordEntity(table.id.value, spec)
      if (found) {
        const event = RecordCreatedEvent.from(
          table,
          userId,
          RecordSqliteMapper.toDomain(table.id.value, schema, found).unwrap(),
        )
        this.outboxService.persist(event)
      }
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }

  async insertMany(table: CoreTable, records: CoreRecord[]): Promise<void> {
    if (!records.length) return

    const userId = this.cls.get('user.userId')

    const schema = table.schema.toIdMap()

    // await this.uow.begin()
    const em = this.em
    try {
      const mapper = async (record: Record) => {
        await this._insert(em, record, schema)
      }
      await pMap(records, mapper, { concurrency: 500 })

      for (const chuncked of chunk(records, 1000)) {
        const event = RecordBulkCreatedEvent.from(table, userId, chuncked)
        this.outboxService.persist(event)
        await this.outboxService.flush()
      }

      // await this.uow.commit()
    } catch (error) {
      // await this.uow.rollback()
      throw error
    }
  }

  private async _populateTable(table: Table) {
    for (const field of table.fields) {
      if (field instanceof ReferenceField) {
        if (!field.foreignTable?.fields.isInitialized()) {
          await field.foreignTable?.fields.init()
        }
        if (!field.displayFields.isInitialized()) {
          await field.displayFields.init()
        }
        const displayFields = field.foreignDisplayFields
        for (const f of displayFields) {
          if (f instanceof SelectField) {
            await f.options.init()
          }
        }
      }
    }
  }

  private async findOneRecordEntity(
    tableId: string,
    spec: IRecordSpec | null,
    em = this.em,
    includeDeleted = false,
  ): Promise<RecordSqlite | null> {
    const tableEntity = await em.findOneOrFail(
      Table,
      { id: tableId },
      {
        populate: [
          'views',
          'forms',
          'fields.options',
          'fields.displayFields',
          'fields.countFields',
          'fields.minFields',
          'fields.minAggregateField',
          'fields.maxFields',
          'fields.maxAggregateField',
          'fields.sumAggregateField',
          'fields.sumFields',
          'fields.averageFields',
          'fields.averageAggregateField',
          'fields.lookupFields',
          'fields.foreignTable',
          'views.widgets.visualization',
        ],
      },
    )
    await this._populateTable(tableEntity)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    spec = spec
      ? WithRecordTableId.fromString(tableId).unwrap().and(spec)
      : WithRecordTableId.fromString(tableId).unwrap()

    const builder = new RecordSqliteQueryBuilder(em, table, tableEntity, spec)
      .select()
      .from()
      .where(includeDeleted)
      .reference()
      .build()

    const data = await em.execute<RecordSqlite[]>(builder.qb.first())

    return data[0] ?? null
  }

  async findOne(table: CoreTable, spec: IRecordSpec | null): Promise<Option<CoreRecord>> {
    const tableId = table.id.value
    const data = await this.findOneRecordEntity(tableId, spec)
    if (!data) {
      return None
    }

    const schema = table.schema.toIdMap()

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  async findOneById(table: CoreTable, id: string): Promise<Option<CoreRecord>> {
    const tableId = table.id.value

    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
    const data = await this.findOneRecordEntity(tableId, spec)

    if (!data) {
      return None
    }

    const schema = table.schema.toIdMap()

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  async findDeletedOneById(table: CoreTable, id: string): Promise<Option<CoreRecord>> {
    const tableId = table.id.value

    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
    const data = await this.findOneRecordEntity(tableId, spec, this.em, true)

    if (!data) {
      return None
    }

    const schema = table.schema.toIdMap()

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  private async findRecordsEntity(tableId: string, spec: IRecordSpec): Promise<RecordSqlite[]> {
    const em = this.em
    const tableEntity = await em.findOneOrFail(
      Table,
      { id: tableId },
      {
        populate: [
          'fields',
          'fields.options',
          'fields.displayFields',
          'fields.countFields',
          'fields.minFields',
          'fields.minAggregateField',
          'fields.maxFields',
          'fields.maxAggregateField',
          'fields.sumAggregateField',
          'fields.sumFields',
          'fields.averageFields',
          'fields.averageAggregateField',
          'fields.lookupFields',
          'fields.foreignTable',
          'views.widgets.visualization',
        ],
      },
    )
    await this._populateTable(tableEntity)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()

    const builder = new RecordSqliteQueryBuilder(em, table, tableEntity, spec)
      .select()
      .from()
      .where()
      .reference()
      .build()

    const data = await em.execute<RecordSqlite[]>(builder.qb)
    return data
  }

  async find(table: CoreTable, spec: IRecordSpec): Promise<CoreRecord[]> {
    const tableId = table.id.value
    const data = await this.findRecordsEntity(tableId, spec)

    const schema = table.schema.toIdMap()

    const record = data.map((r) => RecordSqliteMapper.toDomain(tableId, schema, r).unwrap())
    return record
  }

  private async _update(em: EntityManager, tableId: string, schema: TableSchemaIdMap, id: string, spec: IRecordSpec) {
    const knex = em.getKnex()
    const qb = knex.queryBuilder()

    const qv = new RecordSqliteQueryVisitor(tableId, schema, em, qb, knex)
    WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id)).accept(qv)

    const mv = new RecordSqliteMutationVisitor(this.cls, tableId, id, schema, em, qb)
    spec.accept(mv)

    await mv.commit()

    return mv
  }

  async updateOneById(table: CoreTable, id: string, spec: IRecordSpec): Promise<void> {
    const tableId = table.id.value
    const userId = this.cls.get('user.userId')

    const schema = table.schema.toIdMap()

    await this.uow.begin()
    const em = this.em

    try {
      const idSpec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
      const previousRecord = await this.findOneRecordEntity(tableId, idSpec, em)
      if (!previousRecord) throw new Error('record not found')

      const visitor = await this._update(this.em, tableId, schema, id, spec)

      const record = await this.findOneRecordEntity(tableId, idSpec, em)

      if (record) {
        const event = RecordUpdatedEvent.from(
          table,
          None,
          userId,
          RecordSqliteMapper.toDomain(tableId, schema, previousRecord).unwrap(),
          RecordSqliteMapper.toDomain(tableId, schema, record).unwrap(),
          visitor.updatedFieldIds,
        )

        this.outboxService.persist(event)
      }
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }

  async updateManyByIds(table: CoreTable, updates: { id: string; spec: IRecordSpec }[]): Promise<void> {
    if (!updates.length) return
    const tableId = table.id.value
    const userId = this.cls.get('user.userId')

    const schema = table.schema.toIdMap()

    const idsSpec = WithRecordIds.fromIds(updates.map((u) => u.id))
    const previousRecords = await this.findRecordsEntity(tableId, idsSpec)

    await this.uow.begin()
    const em = this.em

    try {
      const updated = await Promise.all(
        updates.map(async (update) => {
          const visitor = await this._update(em, tableId, schema, update.id, update.spec)
          return { id: update.id, visitor }
        }),
      )

      const updatedFields = new Map()
      for (const update of updated) {
        updatedFields.set(update.id, update.visitor.updatedFieldIds)
      }

      const records = await this.findRecordsEntity(tableId, idsSpec)
      const event = RecordBulkUpdatedEvent.from(
        table,
        None,
        userId,
        previousRecords.map((record) => RecordSqliteMapper.toDomain(tableId, schema, record).unwrap()),
        records.map((record) => RecordSqliteMapper.toDomain(tableId, schema, record).unwrap()),
        updatedFields,
      )
      this.outboxService.persist(event)
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }

  async deleteOneById(table: CoreTable, id: string): Promise<void> {
    const userId = this.cls.get('user.userId')

    await this.uow.begin()
    const em = this.em

    const tableId = table.id.value
    const schema = table.schema.toIdMap()

    try {
      const table = await em.findOneOrFail(Table, tableId, {
        populate: ['referencedBy'],
        lockMode: LockMode.PESSIMISTIC_WRITE,
      })

      const idSpec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
      const record = await this.findOneRecordEntity(tableId, idSpec, em)
      if (!record) throw new Error('not found record')

      const knex = em.getKnex()
      const qb = knex.queryBuilder()

      qb.from(tableId)
        .update({
          [INTERNAL_COLUMN_DELETED_AT_NAME]: new Date(),
          [INTERNAL_COLUMN_DELETED_BY_NAME]: userId,
        })
        .where({ id })

      const coreTable = TableSqliteMapper.entityToDomain(table).unwrap()
      const mv = new RecordSqliteMutationVisitor(this.cls, tableId, id, schema, em, qb)
      const specs: WithRecordValues[] = []

      for (const [fieldId, field] of schema.entries()) {
        if (field instanceof TreeField || field instanceof ParentField) {
          const spec = WithRecordValues.fromObject(schema, { [fieldId]: null })
          specs.push(spec)
        }
      }

      const spec = and(...specs).into()
      spec?.accept(mv)

      await em.execute(qb)
      await mv.commit()

      const tm = new UnderlyingTableSqliteManager(em)
      await tm.deleteRecord(table, id)

      const event = RecordDeletedEvent.from(
        coreTable,
        userId,
        RecordSqliteMapper.toDomain(table.id, coreTable.schema.toIdMap(), record).unwrap(),
      )
      this.outboxService.persist(event)
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }

  async deleteManyByIds(coreTable: CoreTable, ids: string[]): Promise<void> {
    if (!ids.length) return
    const tableId = coreTable.id.value

    const schema = coreTable.schema.toIdMap()

    const userId = this.cls.get('user.userId')

    await this.uow.begin()
    const em = this.em
    try {
      const table = await em.findOneOrFail(Table, tableId, {
        populate: ['referencedBy'],
        lockMode: LockMode.PESSIMISTIC_WRITE,
      })

      const knex = em.getKnex()
      const qb = knex
        .queryBuilder()
        .from(tableId)
        .update(INTERNAL_COLUMN_DELETED_AT_NAME, new Date())
        .update(INTERNAL_COLUMN_DELETED_BY_NAME, userId)
        .whereIn(INTERNAL_COLUMN_ID_NAME, ids)

      for (const id of ids) {
        const mv = new RecordSqliteMutationVisitor(this.cls, tableId, id, schema, em, qb)
        const specs: WithRecordValues[] = []

        for (const [fieldId, field] of schema.entries()) {
          if (field instanceof TreeField || field instanceof ParentField) {
            const spec = WithRecordValues.fromObject(schema, { [fieldId]: null })
            specs.push(spec)
          }
        }

        const spec = and(...specs).into()

        spec?.accept(mv)
        await mv.commit()
        const tm = new UnderlyingTableSqliteManager(em)
        await tm.deleteRecord(table, id)
      }

      const idsSpec = WithRecordIds.fromIds(ids)
      const records = await this.findRecordsEntity(tableId, idsSpec)
      await em.execute(qb)
      const event = RecordBulkDeletedEvent.from(
        coreTable,
        userId,
        records.map((record) =>
          RecordSqliteMapper.toDomain(coreTable.id.value, coreTable.schema.toIdMap(), record).unwrap(),
        ),
      )
      this.outboxService.persist(event)
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }

  async restoreOneById(table: CoreTable, id: string): Promise<void> {
    try {
      const userId = this.cls.get('user.userId')
      await this.uow.begin()
      const em = this.em

      const tableId = table.id.value
      const schema = table.schema.toIdMap()

      const knex = em.getKnex()
      const qb = knex.queryBuilder()

      qb.from(tableId)
        .update({
          [INTERNAL_COLUMN_DELETED_AT_NAME]: null,
          [INTERNAL_COLUMN_DELETED_BY_NAME]: null,
        })
        .where({ id })

      await em.execute(qb)

      const idSpec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
      const record = await this.findOneRecordEntity(tableId, idSpec, em)
      if (!record) throw new Error('not found record')

      const event = RecordRestoredEvent.from(
        table,
        userId,
        RecordSqliteMapper.toDomain(table.id.value, schema, record).unwrap(),
      )
      this.outboxService.persist(event)
      await this.uow.commit()
    } catch (error) {
      await this.uow.rollback()
      throw error
    }
  }
}
