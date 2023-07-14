import type { EntityManager, Knex } from '@mikro-orm/better-sqlite'
import type { NoneSystemField } from '@undb/core'
import { INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME } from '@undb/core'
import type { IUnderlyingColumnBuilder } from '../interfaces/underlying-table.builder.js'
import { UnderlyingColumnFactory } from './underlying-column.factory.js'
import {
  UnderlyingAutoIncrementColumn,
  UnderlyingCreatedAtColumn,
  UnderlyingCreatedByColumn,
  UnderlyingDeletedAtColumn,
  UnderlyingDeletedByColumn,
  UnderlyingIdColumn,
  UnderlyingUpdatedAtColumn,
  UnderlyingUpdatedByColumn,
} from './underlying-column.js'

export class UnderlyingColumnBuilder implements IUnderlyingColumnBuilder {
  constructor(
    private readonly em: EntityManager,
    private readonly knex: Knex,
    private readonly tb: Knex.TableBuilder,
    private readonly tableName: string,
    private readonly isNewTable?: boolean,
  ) {}
  public queries: string[] = []

  private addQueries(...queries: string[]) {
    for (const query of queries) {
      this.queries.push(query)
    }
  }

  public build() {
    return this.queries
  }

  createAutoIncrement(): this {
    new UnderlyingAutoIncrementColumn(undefined, this.tableName).build(this.tb)

    return this
  }

  createId(): this {
    const column = new UnderlyingIdColumn(undefined, this.tableName)
    column.build(this.tb)

    const unique = this.knex
      .raw(
        `
      create unique index IF NOT EXISTS \`${this.tableName}_${column.name}_unique\` on \`${this.tableName}\` (\`${column.name}\`)
      `,
      )
      .toQuery()

    this.addQueries(unique)

    return this
  }

  createCreatedAt(): this {
    new UnderlyingCreatedAtColumn(undefined, this.tableName).build(this.tb, this.knex)
    return this
  }

  createCreatedBy(): this {
    new UnderlyingCreatedByColumn(undefined, this.tableName).build(this.tb)
    return this
  }

  createUpdatedAt(): this {
    new UnderlyingUpdatedAtColumn(undefined, this.tableName).build(this.tb, this.knex)

    const query = this.knex
      .raw(
        `
		CREATE TRIGGER IF NOT EXISTS update_at_update_${this.tableName} AFTER UPDATE ON \`${this.tableName}\`
		BEGIN
			update \`${this.tableName}\` SET ${INTERNAL_COLUMN_UPDATED_AT_NAME} = datetime('now') WHERE ${INTERNAL_COLUMN_ID_NAME} = NEW.${INTERNAL_COLUMN_ID_NAME};
		END;
	 `,
      )
      .toQuery()

    this.addQueries(query)

    return this
  }

  createUpdatedBy(): this {
    new UnderlyingUpdatedByColumn(undefined, this.tableName).build(this.tb)
    return this
  }

  createDeletedAt(): this {
    new UnderlyingDeletedAtColumn(undefined, this.tableName).build(this.tb)
    return this
  }

  createDeletedBy(): this {
    new UnderlyingDeletedByColumn(undefined, this.tableName).build(this.tb)
    return this
  }

  createUnderlying(fields: NoneSystemField[], temp = false): this {
    const underlyingColumns = UnderlyingColumnFactory.createMany(fields, this.tableName)

    for (const column of underlyingColumns) {
      if (!column.system) {
        if (temp) {
          column.buildTemp(this.tb)
        } else {
          column.build(this.tb, this.knex, this.isNewTable)
        }
        this.addQueries(...column.queries)
      }
    }

    return this
  }
}
