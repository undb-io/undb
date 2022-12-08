import { Table } from '@egodb/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { TableInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, Error> {
    const table = Table.unsafeCreate({
      id: t.id,
      name: t.name,
      schema: t.schema,
      defaultView: t.defaultView,
    })
    return Ok(table)
  }

  static toInMemory(t: Table): TableInMemory {
    return {
      id: t.id.value,
      name: t.name.value,
      schema: t.schema.fields.map((c) => ({
        id: c.id.value,
        name: c.name.value,
        type: c.type,
        required: c.required,
      })),
      defaultView: {
        name: t.defaultView.name.unpack(),
        displayType: t.defaultView.displayType,
      },
    }
  }
}
