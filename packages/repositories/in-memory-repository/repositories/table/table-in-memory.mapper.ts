import type { Field } from '@egodb/core'
import { Table } from '@egodb/core'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FieldInMemory, TableInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, Error> {
    const table = Table.unsafeCreate({
      id: t.id,
      name: t.name,
      schema: t.schema,
      views: t.views,
    })
    return Ok(table)
  }

  static fieldToInMemopy(f: Field): FieldInMemory {
    return {
      id: f.id.value,
      name: f.name.value,
      type: f.type,
      required: f.required,
    }
  }

  static toInMemory(t: Table): TableInMemory {
    return {
      id: t.id.value,
      name: t.name.value,
      schema: t.schema.fields.map((f) => this.fieldToInMemopy(f)),
      views: t.views.views.map((v) => ({
        name: v.name.unpack(),
        displayType: v.displayType,
        filters: v.filter?.value,
      })),
    }
  }
}
