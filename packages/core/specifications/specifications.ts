import type { ICreateTableInput_internal } from '../table.schema'
import { WithTableViews } from '../view/specifications/views.specification'
import { WithTableId } from './table-id.specifaction'
import { WithTableName } from './table-name.specification'
import { WithTableSchema } from './table-schema.specification'

export const newTableSpec = (input: ICreateTableInput_internal) => {
  return WithTableName.fromString(input.name)
    .and(WithTableId.fromString(input.id))
    .and(WithTableSchema.from(input.schema))
    .and(WithTableViews.from(input.views))
}
