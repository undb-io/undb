import type { Record, TableSchemaMap } from '@egodb/core'
import { RecordFactory } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { RecordInMemory } from './record.type'

export class RecordInMemoryMapper {
  static toDomain(t: RecordInMemory, schema: TableSchemaMap): Result<Record, string> {
    return RecordFactory.fromQuery(t, schema)
  }

  static toInMemory(r: Record): RecordInMemory {
    return {
      id: r.id.value,
      tableId: r.tableId.value,
      createdAt: r.createdAt.unpack(),
      values: r.values.toObject(),
    }
  }
}
