import { Filter } from '@mikro-orm/core'

export const DELETED_AT_COLUMN_NAME = 'deleted_at'
export const FILTER_SOFT_DELETE = 'softDelete'

export const SoftDelete = (): ClassDecorator =>
  Filter({
    name: FILTER_SOFT_DELETE,
    cond: { [DELETED_AT_COLUMN_NAME]: null },
    default: true,
  })
