import type { Knex } from '@mikro-orm/better-sqlite'

export type IUderlyingForeignTableName = `${string}_adjacency_list` | `${string}_closure_table`

export interface IUnderlyingForeignTable {
  get name(): IUderlyingForeignTableName
  getSqls(knex: Knex): string[]
}
