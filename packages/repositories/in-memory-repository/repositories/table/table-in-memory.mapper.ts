import type { Field, Option, Table, TableSchema, View, Views } from '@egodb/core'
import { TableFactory } from '@egodb/core'
import type { Result } from 'oxide.ts'
import type {
  CalendarInMemory,
  FieldInMemory,
  KanbanInMemory,
  OptionInMemory,
  SchemaInMemory,
  TableInMemory,
  ViewInMemory,
  ViewsInMemory,
} from './table'

export class TableInMemoryMapper {
  static toDomain(t: TableInMemory): Result<Table, string> {
    return TableFactory.unsafeCreate({
      id: t.id,
      name: t.name,
      schema: t.schema,
      views: t.views,
    })
  }

  static optionToInMemory(o: Option): OptionInMemory {
    return { id: o.id.value, name: o.name.value, color: { name: o.color.name, shade: o.color.shade } }
  }

  static fieldToInMemopy(f: Field): FieldInMemory {
    if (f.type === 'select') {
      return {
        id: f.id.value,
        name: f.name.value,
        type: f.type,
        required: f.required,
        options: f.options.options.map(this.optionToInMemory),
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

  static kanbanToInMemory(v: View): KanbanInMemory | undefined {
    if (v.kanban.isSome()) {
      return { fieldId: v.kanban.unwrap().fieldId?.value }
    }

    return undefined
  }

  static calendarToInMemory(v: View): CalendarInMemory | undefined {
    if (v.calendar.isSome()) {
      return { fieldId: v.calendar.unwrap().fieldId?.value }
    }

    return undefined
  }

  static viewToInMemory(v: View): ViewInMemory {
    return {
      id: v.name.value,
      name: v.name.unpack(),
      kanban: this.kanbanToInMemory(v),
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
