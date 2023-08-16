import { z } from 'zod'

export const getInvitationsQuerySchema = z.object({
  q: z.string().min(1).optional(),
})
