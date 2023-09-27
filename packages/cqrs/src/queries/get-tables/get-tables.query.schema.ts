import { baseIdSchema } from '@undb/core'
import * as z from 'zod'

export const getTablesQuerySchema = z.object({
  id: z.string().optional(),
  baseId: baseIdSchema.optional(),
})
