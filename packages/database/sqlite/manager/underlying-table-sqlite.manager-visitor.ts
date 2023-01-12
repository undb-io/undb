import type { ITableSpecVisitor, Table, WithNewField, WithTableSchema } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import { UnderlyingTableBuilder } from '../entity/underlying-table/underlying-table.builder'

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

  idEqual(): void {
    throw new Error('Method not implemented.')
  }
  nameEqual(): void {
    throw new Error('Method not implemented.')
  }
  schemaEqual(s: WithTableSchema): void {
    this.sb = this.sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(this.knex, tb, this.tableName)
      builder.createUnderlying(s.schema.fields)
    })
  }
  viewsEqual(): void {
    throw new Error('Method not implemented.')
  }
  viewEqual(): void {
    throw new Error('Method not implemented.')
  }
  filterEqual(): void {
    throw new Error('Method not implemented.')
  }
  newField(s: WithNewField): void {
    this.sb = this.sb.alterTable(this.tableName, (tb) => {
      const builder = new UnderlyingTableBuilder(this.knex, tb, this.tableName)
      builder.createUnderlying([s.field])
    })
  }
  fieldsOrder(): void {
    throw new Error('Method not implemented.')
  }
  fieldWidthEqual(): void {
    throw new Error('Method not implemented.')
  }
  fieldVisibility(): void {
    throw new Error('Method not implemented.')
  }
  displayTypeEqual(): void {
    throw new Error('Method not implemented.')
  }
  kanbanFieldEqual(): void {
    throw new Error('Method not implemented.')
  }
  calendarFieldEqual(): void {
    throw new Error('Method not implemented.')
  }
  optionsEqual(): void {
    throw new Error('Method not implemented.')
  }
  newOption(): void {
    throw new Error('Method not implemented.')
  }
  not(): this {
    throw new Error('Method not implemented.')
  }
}
