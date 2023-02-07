import type { IRecordRepository, IRecordSpec, Record as CoreRecord, TableSchemaIdMap } from '@egodb/core'
import {
  INTERNAL_COLUMN_ID_NAME,
  ParentField,
  TreeField,
  WithRecordId,
  WithRecordTableId,
  WithRecordValues,
} from '@egodb/core'
import { and } from '@egodb/domain'
import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants'
import { UnderlyingColumnFactory } from '../../underlying-table/underlying-column.factory'
import type { Job } from '../base-entity-manager'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'
import { RecordValueSqliteMutationVisitor } from './record-value-sqlite.mutation-visitor'
import type { RecordSqlite } from './record.type'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager) {}
  async insert(record: CoreRecord, schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional(async (em) => {
      const data: Record<string, Knex.Value> = {
        id: record.id.value,
      }
      const queries: string[] = []
      const jobs: Job[] = []

      for (const [fieldId, value] of record.values) {
        const visitor = new RecordValueSqliteMutationVisitor(
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
    })
  }

  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const knex = this.em.getKnex()
    const qb = knex.queryBuilder()
    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))

    const columns = UnderlyingColumnFactory.createMany([...schema.values()])
    qb.select(columns.map((c) => c.name))

    const qv = new RecordSqliteQueryVisitor(tableId, 't', schema, qb, knex)
    spec.accept(qv)

    const data = await this.em.execute<RecordSqlite[]>(qb.first())

    const record = RecordSqliteMapper.toDomain(tableId, schema, data[0]).unwrap()
    return Some(record)
  }

  async updateOneById(tableId: string, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void> {
    await this.em.transactional(async (em) => {
      const knex = em.getKnex()
      const qb = knex.queryBuilder()

      const qv = new RecordSqliteQueryVisitor(tableId, 't', schema, qb, knex)
      WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id)).accept(qv)

      const mv = new RecordSqliteMutationVisitor(tableId, id, schema, em, qb)
      spec.accept(mv)

      await mv.commit()
    })
  }

  async deleteOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional(async (em) => {
      const knex = em.getKnex()
      const qb = knex.queryBuilder()

      qb.from(tableId)
        .update({ [INTERNAL_COLUMN_DELETED_AT_NAME]: new Date() })
        .where({ id })

      const mv = new RecordSqliteMutationVisitor(tableId, id, schema, em, qb)
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
    })
  }

  async deleteManyByIds(tableId: string, ids: string[], schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional(async (em) => {
      const knex = em.getKnex()
      const qb = knex
        .queryBuilder()
        .from(tableId)
        .update(INTERNAL_COLUMN_DELETED_AT_NAME, new Date())
        .whereIn(INTERNAL_COLUMN_ID_NAME, ids)

      for (const id of ids) {
        const mv = new RecordSqliteMutationVisitor(tableId, id, schema, em, qb)
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
      }

      await em.execute(qb)
    })
  }
}
