import type { Field } from '@egodb/core'
import { INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUnderlyingColumnBuilder } from '../interfaces/underlying-table.builder'
import {
  UnderlyingAutoIncreamentColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingDeletedAtColumn,
  UnderlyingIdColumn,
  UnderlyingUpdatedAtColumn,
} from './underlying-column'
import { UnderlyingColumnFactory } from './underlying-column.factory'

export class UnderlyingColumnBuilder implements IUnderlyingColumnBuilder {
  constructor(private readonly knex: Knex, private readonly tb: Knex.TableBuilder) {}
  private queries: string[] = []

  private addQueries(...queries: string[]) {
    for (const query of queries) {
      this.queries.push(query)
    }
  }

  public build() {
    return this.queries
  }

  createAutoIncrement(): this {
    new UnderlyingAutoIncreamentColumn().build(this.tb)

    return this
  }

  createId(tableName: string): this {
    const column = new UnderlyingIdColumn()
    column.build(this.tb)

    const index = this.knex
      .raw(
        `
      create index \`${tableName}_${column.name}_index\` on \`${tableName}\` (\`${column.name}\`)
    `,
      )
      .toQuery()

    const unique = this.knex
      .raw(
        `
      create unique index \`${tableName}_${column.name}_unique\` on \`${tableName}\` (\`${column.name}\`)
      `,
      )
      .toQuery()

    this.addQueries(index, unique)

    return this
  }

  createCreatedAt(): this {
    new UnderlyingCreatedAtColumn().build(this.tb, this.knex)
    return this
  }

  createUpdatedAt(tableName: string): this {
    new UnderlyingUpdatedAtColumn().build(this.tb, this.knex)

    const query = this.knex
      .raw(
        `
		CREATE TRIGGER update_at_update_${tableName} AFTER UPDATE ON \`${tableName}\`
		BEGIN
			update \`${tableName}\` SET ${INTERNAL_COLUMN_UPDATED_AT_NAME} = datetime('now') WHERE ${INTERNAL_COLUMN_ID_NAME} = NEW.${INTERNAL_COLUMN_ID_NAME};
		END;
	 `,
      )
      .toQuery()

    this.addQueries(query)

    return this
  }

  createDeletedAt(): this {
    new UnderlyingDeletedAtColumn().build(this.tb)
    return this
  }

  createUnderlying(fields: Field[]): this {
    const underlyingColumns = UnderlyingColumnFactory.createMany(fields)

    for (const column of underlyingColumns) {
      column.build(this.tb, this.knex)
    }

    return this
  }
}
