import { fieldIdSchema, tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const setFieldDisplaysCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  display: z.boolean(),
})
