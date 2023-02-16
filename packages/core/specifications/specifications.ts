import type { ICreateTableInput_internal } from '../table.schema.js'
import { WithViewsOrder } from '../view/index.js'
import { WithTableViews } from '../view/specifications/views.specification.js'
import { WithTableId } from './table-id.specification.js'
import { WithTableName } from './table-name.specification.js'
import { WithTableSchema } from './table-schema.specification.js'

export const newTableSpec = (input: ICreateTableInput_internal) => {
  const views = WithTableViews.from(input.views)
  return WithTableName.fromString(input.name)
    .and(WithTableId.fromString(input.id))
    .and(WithTableSchema.from(input.schema))
    .and(views)
    .and(WithViewsOrder.fromArray(views.views.views.map((v) => v.id.value)))
}
