import { queryInivtation } from '@undb/integrations'
import { z } from 'zod'

export const getInvitationByIdQueryOutput = z.object({
  invitation: queryInivtation.optional(),
})
