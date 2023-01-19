import type { IRecordRepository, IRecordSpec, Record as CoreRecord, TableSchemaIdMap } from '@egodb/core'
import { WithRecordId, WithRecordTableId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import type { RecordValueData } from '../../types/record-value-sqlite.type'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants'
import { getColumnNames } from '../../underlying-table/underlying-table.utils'
import { RecordValueSqliteVisitor } from '../values/record-value-sqlite.visitor'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager) {}

  async insert(record: CoreRecord, schema: TableSchemaIdMap): Promise<void> {
    await this.em.transactional(async (em) => {
      const data: RecordValueData = {
        id: record.id.value,
      }
      const queries: string[] = []

      for (const [fieldId, value] of record.values) {
        const visitor = new RecordValueSqliteVisitor(record.tableId.value, fieldId, record.id.value, schema, em)

        value.accept(visitor)

        Object.assign(data, visitor.data)
        queries.push(...visitor.queries)
      }

      const qb = em.getKnex().insert(data).into(record.tableId.value)
      await em.execute(qb)
      for (const query of queries) {
        await em.execute(query)
      }
    })
  }

  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const qb = this.em.getKnex().queryBuilder()
    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))

    qb.select(getColumnNames([...schema.values()]))

    const qv = new RecordSqliteQueryVisitor(qb)
    spec.accept(qv)

    const data = await this.em.execute(qb.first())

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  async updateOneById(tableId: string, id: string, schema: TableSchemaIdMap, spec: IRecordSpec): Promise<void> {
    await this.em.transactional(async (em) => {
      const qb = em.getKnex().queryBuilder()

      const qv = new RecordSqliteQueryVisitor(qb)
      WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id)).accept(qv)

      const mv = new RecordSqliteMutationVisitor(tableId, id, schema, em, qb)
      spec.accept(mv)

      await mv.commit()
    })
  }

  async deleteOneById(tableId: string, id: string): Promise<void> {
    const qb = this.em.getKnex().queryBuilder()

    qb.from(tableId)
      .update({ [INTERNAL_COLUMN_DELETED_AT_NAME]: new Date() })
      .where({ id })

    await this.em.execute(qb)
  }
}
