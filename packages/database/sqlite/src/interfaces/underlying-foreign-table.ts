import type { Knex } from '@mikro-orm/better-sqlite'

export type IUderlyingForeignTableName =
  | `${string}_adjacency_list`
  | `${string}_closure_table`
  | `${string}_collaborator`

export type IUderlyingForeignTableReferenceFieldId = `${IUderlyingForeignTableName}.${string}`

export interface IUnderlyingForeignTable {
  get name(): IUderlyingForeignTableName
  get fromId(): IUderlyingForeignTableReferenceFieldId
  get toId(): IUderlyingForeignTableReferenceFieldId
  getCreateTableSqls(knex: Knex): string[]
}
