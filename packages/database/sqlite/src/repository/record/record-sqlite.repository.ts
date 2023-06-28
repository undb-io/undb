import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { LockMode } from '@mikro-orm/core'
import type {
  Record as CoreRecord,
  Table as CoreTable,
  IClsService,
  IRecordRepository,
  IRecordSpec,
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
  RecordUpdatedEvent,
  TreeField,
  TreeFieldValue,
  WithRecordId,
  WithRecordIds,
  WithRecordTableId,
  WithRecordValues,
} from '@undb/core'
import type { IUnitOfWork } from '@undb/domain'
import { and } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { ReferenceField, SelectField } from '../../entity/field.js'
import { Table } from '../../entity/table.js'
import type { IOutboxService } from '../../services/outbox.service.js'
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
    protected readonly cls: IClsService,
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
    for (const query of queries) {
      await em.execute(query)
    }
    await Promise.all(jobs.map((job) => job()))
  }

  async insert(table: CoreTable, record: CoreRecord, schema: TableSchemaIdMap): Promise<void> {
    const userId = this.cls.get('user.userId')

    // await this.uow.begin()
    const em = this.em
    try {
      await this._insert(em, record, schema)
      const spec = WithRecordTableId.fromString(table.id.value).unwrap().and(WithRecordId.fromString(record.id.value))
      const found = await this.findOneRecordEntity(table.id.value, spec)
      if (found) {
        const event = RecordCreatedEvent.from(table, userId, RecordSqliteMapper.toQuery(table.id.value, schema, found))
        this.outboxService.persist(event)
      }
      // await this.uow.commit()
    } catch (error) {
      // await this.uow.rollback()
      throw error
    }
  }

  async insertMany(table: CoreTable, records: CoreRecord[], schema: TableSchemaIdMap): Promise<void> {
    const userId = this.cls.get('user.userId')

    await this.em.transactional(async (em) => {
      await Promise.all(records.map((record) => this._insert(em, record, schema)))
      const spec = WithRecordIds.fromIds(records.map((r) => r.id.value))
      const found = await this.findRecordsEntity(table.id.value, spec)
      if (found.length) {
        const event = RecordBulkCreatedEvent.from(
          table,
          userId,
          found.map((r) => RecordSqliteMapper.toQuery(table.id.value, schema, r)),
        )
        this.outboxService.persist(event)
      }
    })
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
  ): Promise<RecordSqlite | null> {
    const tableEntity = await em.findOneOrFail(
      Table,
      { id: tableId },
      {
        populate: [
          'views',
          'fields.options',
          'fields.displayFields',
          'fields.countFields',
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
      .where()
      .reference()
      .build()

    const data = await em.execute<RecordSqlite[]>(builder.qb.first())

    return data[0] ?? null
  }

  async findOne(tableId: string, spec: IRecordSpec | null, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const data = await this.findOneRecordEntity(tableId, spec)
    if (!data) {
      return None
    }

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
    const data = await this.findOneRecordEntity(tableId, spec)

    if (!data) {
      return None
    }

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

  async find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<CoreRecord[]> {
    const data = await this.findRecordsEntity(tableId, spec)

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
  }

  async updateOneById(table: CoreTable, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void> {
    const tableId = table.id.value
    const userId = this.cls.get('user.userId')

    // await this.uow.begin()
    const em = this.em

    try {
      const idSpec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))
      const previousRecord = await this.findOneRecordEntity(tableId, idSpec, em)
      if (!previousRecord) throw new Error('record not found')

      await this._update(this.em, tableId, schema, id, spec)

      const record = await this.findOneRecordEntity(tableId, idSpec, em)

      if (record) {
        const event = RecordUpdatedEvent.from(
          table,
          userId,
          RecordSqliteMapper.toQuery(tableId, schema, previousRecord),
          RecordSqliteMapper.toQuery(tableId, schema, record),
        )

        this.outboxService.persist(event)
      }
      // await this.uow.commit()
    } catch (error) {
      // await this.uow.rollback()
      throw error
    }
  }

  async updateManyByIds(
    table: CoreTable,
    schema: TableSchemaIdMap,
    updates: { id: string; spec: IRecordSpec }[],
  ): Promise<void> {
    if (!updates.length) return
    const tableId = table.id.value
    const userId = this.cls.get('user.userId')

    const idsSpec = WithRecordIds.fromIds(updates.map((u) => u.id))
    const previousRecords = await this.findRecordsEntity(tableId, idsSpec)

    await this.em.transactional(async (em) => {
      await Promise.all(updates.map((update) => this._update(em, tableId, schema, update.id, update.spec)))
    })

    const records = await this.findRecordsEntity(tableId, idsSpec)
    const event = RecordBulkUpdatedEvent.from(
      table,
      userId,
      RecordSqliteMapper.toQueries(tableId, schema, previousRecords),
      RecordSqliteMapper.toQueries(tableId, schema, records),
    )
    this.outboxService.persist(event)
  }

  async deleteOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<void> {
    const userId = this.cls.get('user.userId')

    await this.em.transactional(async (em) => {
      const table = await em.findOneOrFail(Table, tableId, {
        populate: ['referencedBy'],
        lockMode: LockMode.PESSIMISTIC_WRITE,
      })
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

      const event = RecordDeletedEvent.from(coreTable, userId, id)
      this.outboxService.persist(event)
    })
  }

  async deleteManyByIds(coreTable: CoreTable, ids: string[], schema: TableSchemaIdMap): Promise<void> {
    if (!ids.length) return
    const tableId = coreTable.id.value

    const userId = this.cls.get('user.userId')

    await this.em.transactional(async (em) => {
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

      await em.execute(qb)
      const event = RecordBulkDeletedEvent.from(coreTable, userId, ids)
      this.outboxService.persist(event)
    })
  }
}
