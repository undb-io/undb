import type { Record } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

export class RecordInMemoryMapper {
  static toDomain(t: RecordInMemory): Result<Record, Error> {
    throw new Error('unimplemented')
  }

  static toInMemory(r: Record): RecordInMemory {
    return {
      id: r.id.value,
      tableId: r.tableId.value,
      values: r.values.toObject(),
    }
  }
}
