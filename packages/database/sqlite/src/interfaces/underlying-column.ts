import type { Knex } from '@mikro-orm/better-sqlite'

export interface IUnderlyingColumn {
  get system(): boolean
  get name(): string
  build(tb: Knex.TableBuilder, knex: Knex): void
}
