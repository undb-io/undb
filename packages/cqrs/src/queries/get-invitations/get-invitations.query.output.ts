import { queryInivtation } from '@undb/integrations'
import { z } from 'zod'

export const getInvitationsQueryOutput = z.object({
  invitations: queryInivtation.array(),
})
