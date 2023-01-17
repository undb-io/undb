import type { IRecordRepository, IRecordSpec, Record as CoreRecord, TableSchemaIdMap } from '@egodb/core'
import { DateRangeFieldValue, ReferenceFieldValue, WithRecordId, WithRecordTableId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import type { Primitive } from 'type-fest'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../underlying-table/constants'
import { getColumnNames } from '../../underlying-table/underlying-table.utils'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager) {}

  async insert(record: CoreRecord): Promise<void> {
    const knex = this.em.getKnex()
    // TODO
    const data = [...record.values.value.entries()].reduce<Record<string, Primitive | Date | string[]>>(
      (prev, [fieldId, value]) => {
        if (value instanceof DateRangeFieldValue) {
          prev[fieldId + '_from'] = value.from.into()
          prev[fieldId + '_to'] = value.to.into()
        } else if (value instanceof ReferenceFieldValue) {
          prev[fieldId] = value.unpack() === null ? value.unpack() : JSON.stringify(value.unpack())
        } else {
          prev[fieldId] = value.unpack()
        }
        return prev
      },
      {} as Record<string, Primitive | Date | string[]>,
    )
    data['id'] = record.id.value
    await this.em.execute(knex.insert(data).into(record.tableId.value))
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
