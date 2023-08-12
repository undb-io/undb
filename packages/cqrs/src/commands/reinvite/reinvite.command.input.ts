import { inviteIdSchema, reinviteSchema } from '@undb/integrations'
import { z } from 'zod'

export const reinviteCommandInput = reinviteSchema.merge(
  z.object({
    id: inviteIdSchema,
  }),
)
