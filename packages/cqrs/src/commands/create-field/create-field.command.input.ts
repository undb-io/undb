import { createFieldSchema, tableIdSchema } from '@egodb/core'
import { z } from 'zod'

export const createFieldCommandInput = z.object({
  tableId: tableIdSchema,
  field: createFieldSchema,
})
