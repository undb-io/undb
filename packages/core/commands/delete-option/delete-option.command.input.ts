import * as z from 'zod'
import { fieldKeySchema } from '../../field/value-objects/field-key.schema'
import { optionIdSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const deleteOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldKey: fieldKeySchema,
  id: optionIdSchema,
})
export type IDeleteOptionInput = z.infer<typeof deleteOptionCommandInput>
