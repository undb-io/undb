import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema.js'
import { optionIdSchema } from '../../option/index.js'
import { tableIdSchema } from '../../value-objects/index.js'

export const deleteOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
})
export type IDeleteOptionInput = z.infer<typeof deleteOptionCommandInput>
