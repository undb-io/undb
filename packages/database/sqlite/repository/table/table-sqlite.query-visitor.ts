import type {
  ITableSpecVisitor,
  WithCalendarField,
  WithDisplayType,
  WithFieldOption,
  WithFieldVisibility,
  WithFieldWidth,
  WithFilter,
  WithKanbanField,
  WithNewField,
  WithNewOption,
  WithOptions,
  WithoutField,
  WithoutOption,
  WithSorts,
  WithTableId,
  WithTableName,
  WithTableSchema,
  WithTableView,
  WithTableViews,
  WithTreeViewField,
  WithViewFieldsOrder,
} from '@egodb/core'
import type { QueryBuilder } from '@mikro-orm/better-sqlite'
import type { Table } from '../../entity'

export class TableSqliteQueryVisitor implements ITableSpecVisitor {
  constructor(public qb: QueryBuilder<Table>) {}
  idEqual(s: WithTableId): void {
    this.qb.where({ id: s.id.value })
  }
  nameEqual(s: WithTableName): void {
    this.qb.where({ name: s.name.value })
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
    throw new Error('Method not implemented.')
  }
  kanbanFieldEqual(s: WithKanbanField): void {
    throw new Error('Method not implemented.')
  }
  treeViewFieldEqual(s: WithTreeViewField): void {
    throw new Error('Method not implemented.')
  }
  calendarFieldEqual(s: WithCalendarField): void {
    throw new Error('Method not implemented.')
  }
  optionsEqual(s: WithOptions): void {
    throw new Error('Method not implemented.')
  }
  newOption(s: WithNewOption): void {
    throw new Error('Method not implemented.')
  }
  witoutOption(s: WithoutOption): void {
    throw new Error('Method not implemented.')
  }
  withoutField(s: WithoutField): void {
    throw new Error('Method not implemented.')
  }
  fieldOptionsEqual(s: WithFieldOption): void {
    throw new Error('Method not implemented.')
  }
  optionEqual(s: WithNewOption): void {
    throw new Error('Method not implemented.')
  }
  sortsEqual(s: WithSorts): void {
    throw new Error('Method not implemented.')
  }

  not(): this {
    throw new Error('Method not implemented.')
  }
}
