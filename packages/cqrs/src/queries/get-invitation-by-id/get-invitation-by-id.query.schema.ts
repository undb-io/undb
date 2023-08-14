import { inviteIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const getInvitationByIdQuerySchema = z.object({
  id: inviteIdSchema,
})
