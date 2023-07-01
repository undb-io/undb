import { shareIdSchema, updateShareSchema } from '@undb/integrations'
import { z } from 'zod'

export const updateShareCommandInput = z.object({
  shareId: shareIdSchema,
  update: updateShareSchema,
})
