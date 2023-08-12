import { inviteIdSchema } from '@undb/integrations'
import { z } from 'zod'

export const cancelInvitationCommandInput = z.object({
  id: inviteIdSchema,
})
