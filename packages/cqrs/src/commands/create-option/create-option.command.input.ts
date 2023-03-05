import { createOptionSchema, fieldIdSchema, tableIdSchema } from '@egodb/core'
import * as z from 'zod'

export const createOptionCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  option: createOptionSchema,
})
