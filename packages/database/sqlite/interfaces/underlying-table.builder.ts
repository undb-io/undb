import type { Field } from '@egodb/core'

export interface IUnderlyingColumnBuilder {
  createId(): this
  createCreatedAt(): this
  createUpdatedAt(tableName: string): this
  createDeletedAt(): this
  createUnderlying(fields: Field[]): this
}
