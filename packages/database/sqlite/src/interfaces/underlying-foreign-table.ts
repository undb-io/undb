import type { Knex } from '@mikro-orm/better-sqlite'

export type IUderlyingForeignTableName =
  | `${string}_adjacency_list`
  | `${string}_closure_table`
  | `${string}_collaborator`

export interface IUnderlyingForeignTable {
  get name(): IUderlyingForeignTableName
  getCreateTableSqls(knex: Knex): string[]
}
