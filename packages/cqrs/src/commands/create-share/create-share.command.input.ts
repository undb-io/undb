import { tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createShareCommandInput = z.object({
  tableId: tableIdSchema,
  targetId: tableIdSchema,
  targetType: z.string(),
  enabled: z.boolean(),
})
