import type {
  ITableSpecVisitor,
  Table,
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
import type { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingColumnFactory } from '../entity/underlying-table/underlying-column.factory'

export class UnderlyingTableSqliteManagerVisitor implements ITableSpecVisitor {
  private sb: Knex.SchemaBuilder
  private readonly tableName: string
  constructor(private readonly table: Table, private readonly knex: Knex) {
    this.sb = knex.schema
    this.tableName = table.id.value
  }

  async commit() {
    await this.sb
  }

  idEqual(s: WithTableId): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(s: WithTableName): void {
    throw new Error('Method not implemented.')
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
    const underlyingColumn = UnderlyingColumnFactory.create(s.field)
    this.sb = this.sb.alterTable(this.tableName, (tb) => {
      if (Array.isArray(underlyingColumn)) {
        for (const c of underlyingColumn) {
          c.build(tb, this.knex, this.tableName)
        }
      } else {
        underlyingColumn.build(tb, this.knex, this.tableName)
      }
    })
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
  calendarFieldEqual(s: WithCalendarField): void {
    throw new Error('Method not implemented.')
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
