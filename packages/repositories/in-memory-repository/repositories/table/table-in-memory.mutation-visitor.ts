import type {
  ITableSpecVisitor,
  WithDisplayType,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithNewField,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithViewFieldsOrder,
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

  private getView(viewName?: string) {
    return this.table.views.find((v) => v.name === viewName)
  }

  fieldWidthEqual(s: WithFieldWidth): void {
    const view = this.getView(s.viewName)
    if (view) {
      const option = view.fieldOptions?.[s.fieldName]
      if (option) {
        option.width = s.width
      } else {
        view.fieldOptions[s.fieldName] = { width: s.width }
      }
    }
  }

  viewEqual(s: WithTableView): void {
    const index = this.table.views.findIndex((v) => v.name === s.view.name.unpack())
    this.table.views[index] = TableInMemoryMapper.viewToInMemory(s.view)
  }

  fieldVisibility(s: WithFieldVisibility): void {
    const view = this.getView(s.viewName)
    if (view) {
      const option = view.fieldOptions?.[s.fieldName]
      if (option) {
        option.hidden = s.hidden
      } else {
        view.fieldOptions[s.fieldName] = { hidden: s.hidden }
      }
    }
  }

  fieldsOrder(s: WithViewFieldsOrder): void {
    const view = this.table.views.find((v) => v.name === s.view.name.unpack())
    if (view) {
      view.fieldsOrder = s.viewFieldsOrder.order
    }
  }

  displayTypeEqual(s: WithDisplayType): void {
    const view = this.table.views.find((v) => v.name === s.viewName)
    if (view) {
      view.displayType = s.displayType
    }
  }
}
