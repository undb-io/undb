import { createFieldSchema, tableIdSchema, viewIdSchema } from '@egodb/core'
import { z } from 'zod'

export const createFieldCommandInput = z.object({
  tableId: tableIdSchema,
  field: createFieldSchema,
  viewId: viewIdSchema.optional(),
  at: z.number().nonnegative().int().optional(),
})
