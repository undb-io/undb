import type { IRecordRepository, IRecordSpec, Record as CoreRecord, TableSchemaMap } from '@egodb/core'
import { DateRangeFieldValue } from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Option } from 'oxide.ts'

export class RecordSqliteRepository implements IRecordRepository {
  constructor(protected readonly em: EntityManager) {}

  async insert(record: CoreRecord): Promise<void> {
    const knex = this.em.getKnex()
    const data = [...record.values.value.entries()].reduce<Record<string, any>>((prev, [fieldId, value]) => {
      if (value instanceof DateRangeFieldValue) {
        prev[fieldId + '_from'] = value.unpack()?.[0]
        prev[fieldId + '_to'] = value.unpack()?.[1]
      } else {
        prev[fieldId] = value.unpack()
      }
      return prev
    }, {} as Record<string, any>)
    data['id'] = record.id.value
    await knex.insert(data).into(record.tableId.value)
  }
  findOneById(id: string, schema: TableSchemaMap): Promise<Option<CoreRecord>> {
    throw new Error('Method not implemented.')
  }
  updateOneById(id: string, spec: IRecordSpec): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
