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
  WithTableId,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithViewFieldsOrder,
} from '@egodb/core'
import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import { Table } from '../../entity'
import { View } from '../../entity/view'

export class TableSqliteMutationVisitor implements ITableSpecVisitor {
  constructor(private readonly tableId: string, public em: EntityManager) {}

  idEqual(s: WithTableId): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(s: WithTableName): void {
    const table = this.em.getReference(Table, this.tableId)
    wrap(table).assign({ name: s.name.value })
    this.em.persist(table)
  }
  schemaEqual(s: WithTableSchema): void {
    throw new Error('Method not implemented.')
  }
  viewsEqual(s: WithTableViews): void {
    throw new Error('Method not implemented.')
  }
  viewEqual(s: WithTableView): void {
    throw new Error('Method not implemented.')
  }
  filterEqual(s: WithFilter): void {
    throw new Error('Method not implemented.')
  }
  newField(s: WithNewField): void {
    throw new Error('Method not implemented.')
  }
  fieldsOrder(s: WithViewFieldsOrder): void {
    throw new Error('Method not implemented.')
  }
  fieldWidthEqual(s: WithFieldWidth): void {
    throw new Error('Method not implemented.')
  }
  fieldVisibility(s: WithFieldVisibility): void {
    throw new Error('Method not implemented.')
  }
  displayTypeEqual(s: WithDisplayType): void {
    const view = this.em.getReference(View, [s.view.id.value, this.tableId])
    wrap(view).assign({ displayType: s.displayType })
    this.em.persist(view)
  }
  kanbanFieldEqual(s: WithKanbanField): void {
    const view = this.em.getReference(View, [s.view.id.value, this.tableId])
    wrap(view).assign({ kanban: { fieldId: s.fieldId.value } })
    this.em.persist(view)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const view = this.em.getReference(View, [s.view.id.value, this.tableId])
    wrap(view).assign({ calendar: { fieldId: s.fieldId.value } })
    this.em.persist(view)
  }
  optionsEqual(s: WithOptions): void {
    throw new Error('Method not implemented.')
  }
  newOption(s: WithNewOption): void {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
