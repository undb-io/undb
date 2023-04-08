import type { Knex } from '@mikro-orm/better-sqlite'
import type { Field } from '@undb/core'

export interface IUnderlyingColumn {
  get field(): Field | undefined
  get virtual(): boolean
  get queries(): string[]
  get system(): boolean
  get name(): string
  build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): void
}
