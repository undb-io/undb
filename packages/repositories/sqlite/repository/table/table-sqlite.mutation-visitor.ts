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
import type { EntityManager, UpdateQueryBuilder } from '@mikro-orm/better-sqlite'
import { Table } from '../../entity'
import { View } from '../../entity/view'

export class TableSqliteMutationVisitor implements ITableSpecVisitor {
  public readonly qbs: (UpdateQueryBuilder<View> | UpdateQueryBuilder<Table>)[] = []

  constructor(private readonly tableId: string, public em: EntityManager) {}

  private addQb(qb: UpdateQueryBuilder<View> | UpdateQueryBuilder<Table>) {
    this.qbs.push(qb)
  }

  idEqual(s: WithTableId): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(s: WithTableName): void {
    const qb = this.em.qb(Table).update({ name: s.name.value }).where({ id: this.tableId })
    this.addQb(qb)
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
    const qb = this.em
      .qb(View)
      .update({ displayType: s.displayType })
      .where({ id: s.view.id.value, table: this.tableId })
    this.addQb(qb)
  }
  kanbanFieldEqual(s: WithKanbanField): void {
    const qb = this.em
      .qb(View)
      .update({ kanban: { fieldId: s.fieldId.value } })
      .where({ id: s.view.id.value, table: this.tableId })
    this.addQb(qb)
  }
  calendarFieldEqual(s: WithCalendarField): void {
    const qb = this.em
      .qb(View)
      .update({ calendar: { fieldId: s.fieldId.value } })
      .where({ id: s.view.id.value, table: this.tableId })
    this.addQb(qb)
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
