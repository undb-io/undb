import type { NoneSystemField } from '@undb/core'

export interface IUnderlyingColumnBuilder {
  createAutoIncrement(): this
  createId(tableName: string): this
  createCreatedAt(): this
  createCreatedBy(): this
  createUpdatedAt(tableName: string): this
  createDeletedAt(): this
  createUnderlying(fields: NoneSystemField[]): this
}
