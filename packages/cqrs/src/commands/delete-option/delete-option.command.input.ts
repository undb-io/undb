import { fieldIdSchema, optionIdSchema, tableIdSchema } from '@undb/core'
import * as z from 'zod'

export const deleteOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
})
export type IDeleteOptionInput = z.infer<typeof deleteOptionCommandInput>
