import { fieldIdSchema, optionIdSchema, tableIdSchema, updateOptionSchema } from '@undb/core'
import * as z from 'zod'

export const updateOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  id: optionIdSchema,
  option: updateOptionSchema,
})
