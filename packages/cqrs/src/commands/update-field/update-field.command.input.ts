import { fieldIdSchema, tableIdSchema, updateFieldSchema } from '@undb/core'
import { z } from 'zod'

export const updateFieldCommandInput = z.object({
  tableId: tableIdSchema,
  fieldId: fieldIdSchema,
  field: updateFieldSchema,
})
