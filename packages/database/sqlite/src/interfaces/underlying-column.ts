import type { Knex } from '@mikro-orm/better-sqlite'

export interface IUnderlyingColumn {
  get queries(): string[]
  get system(): boolean
  get name(): string
  build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): void
}
