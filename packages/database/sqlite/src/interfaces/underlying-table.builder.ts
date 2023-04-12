import type { NoneSystemField } from '@undb/core'

export interface IUnderlyingColumnBuilder {
  createAutoIncrement(): this
  createId(tableName: string): this
  createCreatedAt(): this
  createCreatedBy(): this
  createUpdatedAt(): this
  createUpdatedBy(): this
  createDeletedAt(): this
  createDeletedBy(): this
  createUnderlying(fields: NoneSystemField[]): this
}
