import type {
  ITableSpecVisitor,
  WithCalendarField,
  WithDisplayType,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithKanbanField,
  WithNewField,
  WithNewOption,
  WithOptions,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithViewFieldsOrder,
} from '@egodb/core'
import type { SelectFieldInMemory, TableInMemory } from './table'
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
    const view = this.table.views.find((v) => v.name === s.viewId)
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

  private getView(viewId?: string) {
    return this.table.views.find((v) => v.id === viewId)
  }

  fieldWidthEqual(s: WithFieldWidth): void {
    const view = this.getView(s.viewId)
    if (view) {
      const option = view.fieldOptions?.[s.fieldId]
      if (option) {
        option.width = s.width
      } else {
        view.fieldOptions[s.fieldId] = { width: s.width }
      }
    }
  }

  viewEqual(s: WithTableView): void {
    const index = this.table.views.findIndex((v) => v.name === s.view.name.unpack())
    this.table.views[index] = TableInMemoryMapper.viewToInMemory(s.view)
  }

  fieldVisibility(s: WithFieldVisibility): void {
    const view = this.getView(s.viewId)
    if (view) {
      const option = view.fieldOptions?.[s.fieldId]
      if (option) {
        option.hidden = s.hidden
      } else {
        view.fieldOptions[s.fieldId] = { hidden: s.hidden }
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
    const view = this.table.views.find((v) => v.name === s.view.name.value)
    if (view) {
      view.displayType = s.displayType
    }
  }

  kanbanFieldEqual(s: WithKanbanField): void {
    const view = this.table.views.find((v) => v.name === s.view.name.value)
    if (view) {
      if (view.kanban) {
        view.kanban.fieldId = s.fieldId.value
      } else {
        view.kanban = { fieldId: s.fieldId.value }
      }
    }
  }

  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.table.views.find((v) => v.name === s.view.name.value)
    if (view) {
      if (view.calendar) {
        view.calendar.fieldId = s.fieldId.value
      } else {
        view.calendar = { fieldId: s.fieldId.value }
      }
    }
  }

  optionsEqual(s: WithOptions): void {
    const field = this.table.schema.find((f) => f.id === s.field.id.value)
    if (field) {
      ;(field as SelectFieldInMemory).options = s.options.options.map(TableInMemoryMapper.optionToInMemory)
    }
  }

  newOption(s: WithNewOption): void {
    const field = this.table.schema.find((f) => f.id === s.field.id.value)
    if (field) {
      ;(field as SelectFieldInMemory).options.push(TableInMemoryMapper.optionToInMemory(s.option))
    }
  }
}
