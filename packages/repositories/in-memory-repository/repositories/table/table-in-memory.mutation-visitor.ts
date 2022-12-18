import type {
  ITableSpecVisitor,
  WithFieldWidth,
  WithFilter,
  WithNewField,
  WithTableName,
  WithTableSchema,
  WithTableViews,
} from '@egodb/core'
import type { TableInMemory } from './table'
import { TableInMemoryMapper } from './table-in-memory.mapper'

export class TableInMemoryMutationVisitor implements ITableSpecVisitor {
  constructor(private table: TableInMemory) {}
  not(): this {
    return this
  }

  idEqual(): void {
    throw new Error('[TableInMemoryMutationVisitor.idEqual] Method not implemented.')
  }

  nameEqual(s: WithTableName): void {
    this.table.name = s.name.value
  }

  filterEqual(s: WithFilter): void {
    const view = this.table.views.find((v) => v.name === s.viewName)
    if (view) {
      view.filter = s.filter ?? undefined
    }
  }

  schemaEqual(s: WithTableSchema): void {
    this.table.schema = TableInMemoryMapper.schemaToInMemory(s.schema)
  }

  viewsEqual(s: WithTableViews): void {
    this.table.views = TableInMemoryMapper.viewsToInMemory(s.views)
  }

  newField(s: WithNewField): void {
    const field = TableInMemoryMapper.fieldToInMemopy(s.field)
    this.table.schema.push(field)
  }

  fieldWidthEqual(s: WithFieldWidth): void {
    const view = this.table.views.find((v) => v.name === s.viewName)
    if (view) {
      const option = view.fieldOptions?.[s.fieldName]
      if (option) {
        option.width = s.width
      } else {
        view.fieldOptions[s.fieldName] = { width: s.width }
      }
    }
  }
}
