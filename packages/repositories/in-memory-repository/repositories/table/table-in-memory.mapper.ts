import type { Field, Table, TableSchema, View, Views } from '@egodb/core'
import { SelectField, TableFactory } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type { FieldInMemory, SchemaInMemory, TableInMemory, ViewInMemory, ViewsInMemory } from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: t.id,
      name: t.name,
      schema: t.schema,
      views: t.views,
    })
  }

  static fieldToInMemopy(f: Field): FieldInMemory {
    if (f instanceof SelectField) {
      return {
        id: f.id.value,
        name: f.name.value,
        type: f.type,
        required: f.required,
        options: f.options.options.map((o) => ({ id: o.id.value, name: o.name.value })),
      }
    }
    return {
      id: f.id.value,
      name: f.name.value,
      type: f.type,
      required: f.required,
    }
  }

  static schemaToInMemory(schema: TableSchema): SchemaInMemory {
    return schema.fields.map((f) => this.fieldToInMemopy(f))
  }

  static viewToInMemory(v: View): ViewInMemory {
    return {
      name: v.name.unpack(),
      displayType: v.displayType,
      filter: v.filter?.value,
      fieldOptions: Object.fromEntries(v.fieldOptions.value),
      fieldsOrder: v.fieldsOrder?.order,
    }
  }

  static viewsToInMemory(views: Views): ViewsInMemory {
    return views.views.map((v) => this.viewToInMemory(v))
  }

  static toInMemory(t: Table): TableInMemory {
    return {
      id: t.id.value,
      name: t.name.value,
      schema: this.schemaToInMemory(t.schema),
      views: this.viewsToInMemory(t.views),
    }
  }
}
