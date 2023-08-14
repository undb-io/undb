import { inviteIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const sendInvitationMailCommandInput = z.object({
  id: inviteIdSchema,
})
