import * as z from 'zod'
import { fieldIdSchema } from '../../field/value-objects/field-id.schema'
import { optionIdSchema } from '../../option'
import { tableIdSchema } from '../../value-objects'

export const deleteOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
})
export type IDeleteOptionInput = z.infer<typeof deleteOptionCommandInput>
