import { inviteIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const acceptInvitationCommandInput = z.object({
  id: inviteIdSchema,
})
