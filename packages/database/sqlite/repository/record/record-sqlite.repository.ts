import type { IRecordRepository, IRecordSpec, Record as CoreRecord, TableSchemaIdMap } from '@egodb/core'
import { DateRangeFieldValue, WithRecordId, WithRecordTableId } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'
import { Some } from 'oxide.ts'
import type { Primitive } from 'type-fest'
import { INTERNAL_COLUMN_DELETED_AT_NAME } from '../../entity/underlying-table/constants'
import { RecordSqliteMapper } from './record-sqlite.mapper'
import { RecordSqliteMutationVisitor } from './record-sqlite.mutation-visitor'
import { RecordSqliteQueryVisitor } from './record-sqlite.query-visitor'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager) {}

  async insert(record: CoreRecord): Promise<void> {
    const knex = this.em.getKnex()
    // TODO
    const data = [...record.values.value.entries()].reduce<Record<string, Primitive | Date>>(
      (prev, [fieldId, value]) => {
        if (value instanceof DateRangeFieldValue) {
          prev[fieldId + '_from'] = value.from.into()
          prev[fieldId + '_to'] = value.to.into()
        } else {
          prev[fieldId] = value.unpack()
        }
        return prev
      },
      {} as Record<string, Primitive | Date>,
    )
    data['id'] = record.id.value
    await this.em.execute(knex.insert(data).into(record.tableId.value))
  }

  async findOneById(tableId: string, id: string, schema: TableSchemaIdMap): Promise<Option<CoreRecord>> {
    const qb = this.em.getKnex().queryBuilder()
    const spec = WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id))

    const qv = new RecordSqliteQueryVisitor(qb)
    spec.accept(qv)

    const data = await this.em.execute(qb.first())

    const record = RecordSqliteMapper.toDomain(tableId, schema, data).unwrap()
    return Some(record)
  }

  async updateOneById(tableId: string, id: string, spec: IRecordSpec): Promise<void> {
    const qb = this.em.getKnex().queryBuilder()

    const qv = new RecordSqliteQueryVisitor(qb)
    WithRecordTableId.fromString(tableId).unwrap().and(WithRecordId.fromString(id)).accept(qv)

    const mv = new RecordSqliteMutationVisitor(qb)
    spec.accept(mv)

    await this.em.execute(qb)
  }

  async deleteOneById(tableId: string, id: string): Promise<void> {
    const qb = this.em.getKnex().queryBuilder()

    qb.from(tableId)
      .update({ [INTERNAL_COLUMN_DELETED_AT_NAME]: new Date() })
      .where({ id })

    await this.em.execute(qb)
  }
}
