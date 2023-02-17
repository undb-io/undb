import { tableIdSchema, updateFieldSchema } from '@egodb/core'
import { z } from 'zod'

export const updateFieldCommandInput = z.object({
  tableId: tableIdSchema,
  field: updateFieldSchema,
})
