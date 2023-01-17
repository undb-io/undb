import type { Field } from '@egodb/core'
import { INTERNAL_COLUMN_CREATED_AT_NAME, INTERNAL_COLUMN_ID_NAME, INTERNAL_COLUMN_UPDATED_AT_NAME } from '@egodb/core'
import { UnderlyingColumnFactory } from './underlying-column.factory'

export const getColumnNames = (fields: Field[]) => [
  INTERNAL_COLUMN_ID_NAME,
  INTERNAL_COLUMN_CREATED_AT_NAME,
  INTERNAL_COLUMN_UPDATED_AT_NAME,
  ...UnderlyingColumnFactory.createMany(fields).map((f) => f.name),
]
