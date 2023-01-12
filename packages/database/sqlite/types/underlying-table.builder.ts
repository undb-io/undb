import type { Field } from '@egodb/core'

export interface IUnderlyingTableBuilder {
  createId(): this
  createCreatedAt(): this
  createUpdatedAt(): this
  createUnderlying(fields: Field[]): this
}
