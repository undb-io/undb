import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import { LockMode } from '@mikro-orm/core'
import type { Record as CoreRecord, IClsService, IRecordRepository, IRecordSpec, TableSchemaIdMap } from '@undb/core'
import {
  INTERNAL_COLUMN_CREATED_BY_NAME,
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_UPDATED_BY_NAME,
  ParentField,
  TreeField,
  WithRecordId,
  WithRecordTableId,
  WithRecordValues,
} from '@undb/core'
import { and } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import { ReferenceField, SelectField } from '../../entity/field.js'
import { Table } from '../../entity/table.js'
import { INTERNAL_COLUMN_DELETED_AT_NAME, INTERNAL_COLUMN_DELETED_BY_NAME } from '../../underlying-table/constants.js'
import { UnderlyingTableSqliteManager } from '../../underlying-table/underlying-table-sqlite.manager.js'
import type { Job } from '../base-entity-manager.js'
import { TableSqliteMapper } from '../table/table-sqlite.mapper.js'
import { RecordSqliteQueryBuilder } from './record-query.builder.js'
import { RecordSqliteMapper } from './record-sqlite.mapper.js'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor.js'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor.js'
import { RecordSqliteReferenceQueryVisitor } from './record-sqlite.reference-query-visitor.js'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor.js'
import type { RecordSqlite } from './record.type.js'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager, protected readonly cls: IClsService) {}

  private async _insert(em: EntityManager, record: CoreRecord, schema: TableSchemaIdMap) {
    const userId = this.cls.get('user.userId')
    const data: globalThis.Record<string, Knex.Value> = {
      id: record.id.value,
      [INTERNAL_COLUMN_CREATED_BY_NAME]: userId,
      [INTERNAL_COLUMN_UPDATED_BY_NAME]: userId,
    }
    const queries: string[] = []
    const jobs: Job[] = []

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

  async insert(record: CoreRecord, schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional((em) => this._insert(em, record, schema))
  }

  async insertMany(records: CoreRecord[], schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional(async (em) => {
      await Promise.all(records.map((record) => this._insert(em, record, schema)))
    })
  }

  private async _populateTable(table: Table) {
    for (const field of table.fields) {
      if (field instanceof ReferenceField) {
        const displayFields = field.displayFields.getItems()
        for (const f of displayFields) {
          if (f instanceof SelectField) {
            await f.options.init()
          }
        }
      }
    }
  }

  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const tableEntity = await this.em.findOneOrFail(
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
        ],
      },
    )
    await this._populateTable(tableEntity)
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()
    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))

    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec).select().from().where().build()
    new RecordSqliteReferenceQueryVisitor(this.em, builder.knex, builder.qb, table, tableEntity).visit(table)

    const data = await this.em.execute<RecordSqlite[]>(builder.qb.first())

    const record = RecordSqliteMapper.toDomain(tableId, schema, data[0]).unwrap()
    return Some(record)
  }

  async find(tableId: string, spec: IRecordSpec, schema: TableSchemaIdMap): Promise<CoreRecord[]> {
    const tableEntity = await this.em.findOneOrFail(
      Table,
      { id: tableId },
      {
        populate: [
          'fields.options',
          'fields.displayFields',
          'fields.countFields',
          'fields.sumAggregateField',
          'fields.sumFields',
          'fields.averageFields',
          'fields.averageAggregateField',
          'fields.lookupFields',
          'fields.foreignTable',
        ],
      },
    )
    const table = TableSqliteMapper.entityToDomain(tableEntity).unwrap()

    const builder = new RecordSqliteQueryBuilder(this.em, table, tableEntity, spec).select().from().where().build()
    new RecordSqliteReferenceQueryVisitor(this.em, builder.knex, builder.qb, table, tableEntity).visit(table)

    const data = await this.em.execute<RecordSqlite[]>(builder.qb)

    const record = data.map((r) => RecordSqliteMapper.toDomain(tableId, schema, r).unwrap())
    return record
  }

  async updateOneById(tableId: string, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void> {
    await this.em.transactional(async (em) => {
      const knex = em.getKnex()
      const qb = knex.queryBuilder()

      const qv = new RecordSqliteQueryVisitor(tableId, schema, em, qb, knex)
      WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id)).accept(qv)

      const mv = new RecordSqliteMutationVisitor(this.cls, tableId, id, schema, em, qb)
      spec.accept(mv)

      await mv.commit()
    })
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
    })
  }

  async deleteManyByIds(tableId: string, ids: string[], schema: TableSchemaIdMap): Promise<void> {
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
    })
  }
}
