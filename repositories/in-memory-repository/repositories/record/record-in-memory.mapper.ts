import type { QueryRecord } from '@egodb/core'
import { Record } from '@egodb/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

export class RecordInMemoryMapper {
  static toDomain(t: RecordInMemory): Result<Record, Error> {
    const record = Record.unsafeCreate({
      id: t.id,
    })
    return Ok(record)
  }

  static toQueryModel(t: Record): QueryRecord {
    return {
      id: t.id.value,
    }
  }

  static toInMemory(t: Record): RecordInMemory {
    return {
      id: t.id.value,
    }
  }
}
