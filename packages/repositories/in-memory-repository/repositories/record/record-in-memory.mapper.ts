import type { Record } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

export class RecordInMemoryMapper {
  static toDomain(t: RecordInMemory): Result<Record, Error> {
    throw new Error('unimplemented')
  }

  static toInMemory(t: Record): RecordInMemory {
    return {
      id: t.id.value,
      values: t.value.toObject(),
    }
  }
}
