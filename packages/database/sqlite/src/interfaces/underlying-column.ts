import type { Knex } from '@mikro-orm/better-sqlite'

export interface IUnderlyingColumn {
  get fieldId(): string | undefined
  get virtual(): boolean
  get queries(): string[]
  get system(): boolean
  get name(): string
  get tempName(): string
  build(tb: Knex.TableBuilder, knex: Knex, isNewTable?: boolean): void
  buildTemp(tb: Knex.TableBuilder): void
}
