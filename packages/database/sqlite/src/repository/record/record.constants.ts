import type { Field, TableSchemaIdMap } from '@undb/core'
import { LookupField } from '@undb/core'

export const TABLE_ALIAS = 't'
export const FOREIGN_TABLE_ALIAS_PREFIX = 'ft'

export const INTERNAL_COLUMN_NAME_TOTAL = 'total'

export type ForeignTableAlias = `${typeof FOREIGN_TABLE_ALIAS_PREFIX}_${string}`

export const getForeignTableAlias = (field: Field, schema: TableSchemaIdMap): ForeignTableAlias => {
  let ref = field
  if (field instanceof LookupField) {
    ref = field.mustGetReferenceField(schema)
  }
  return `${FOREIGN_TABLE_ALIAS_PREFIX}_${ref.id.value}`
}
