import { tableIdSchema } from '@undb/core'
import { z } from 'zod'

export const createShareCommandInput = z.object({
  targetId: tableIdSchema,
  targetType: z.string(),
})
