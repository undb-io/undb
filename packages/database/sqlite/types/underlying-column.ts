import type { Knex } from '@mikro-orm/better-sqlite'

export interface IUnderlyingColumn {
  get name(): string
  build(tb: Knex.TableBuilder, knex: Knex): Knex.ColumnBuilder
}
