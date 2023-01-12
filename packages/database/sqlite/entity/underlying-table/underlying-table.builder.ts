import type { Field } from '@egodb/core'
import type { Knex } from '@mikro-orm/better-sqlite'
import type { IUnderlyingTableBuilder } from '../../types/underlying-table.builder'
import { UnderlyingCreatedAtColumn, UnderlyingIdColumn, UnderlyingUpdatedAtColumn } from './underlying-column'
import { UnderlyingColumnFactory } from './underlying-column.factory'

export class UnderlyingTableBuilder implements IUnderlyingTableBuilder {
  constructor(
    private readonly knex: Knex,
    private readonly tb: Knex.TableBuilder,
    private readonly tableName: string,
  ) {}
  createId(): this {
    new UnderlyingIdColumn().build(this.tb)
    return this
  }

  createCreatedAt(): this {
    new UnderlyingCreatedAtColumn().build(this.tb, this.knex)
    return this
  }

  createUpdatedAt(): this {
    new UnderlyingUpdatedAtColumn().build(this.tb, this.knex, this.tableName)
    return this
  }

  createUnderlying(fields: Field[]): this {
    const underlyingColumns = UnderlyingColumnFactory.createMany(fields)

    for (const column of underlyingColumns) {
      column.build(this.tb, this.knex, this.tableName)
    }

    return this
  }
}
