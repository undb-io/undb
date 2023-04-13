import type { ClsStore } from '../../cls/cls.js'
import type { ICreateTableInput_internal } from '../table.schema.js'
import { WithTableViews } from '../view/specifications/views.specification.js'
import { WithTableEmoji } from './table-emoji.specification.js'
import { WithTableId } from './table-id.specification.js'
import { WithTableName } from './table-name.specification.js'
import { WithTableSchema } from './table-schema.specification.js'

export const newTableSpec = (input: ICreateTableInput_internal, ctx: ClsStore) => {
  return WithTableName.fromString(input.name)
    .and(WithTableId.fromString(input.id))
    .and(WithTableSchema.from(input.schema, ctx))
    .and(WithTableViews.from(input.views))
    .and(WithTableEmoji.fromString(input.emoji))
}
