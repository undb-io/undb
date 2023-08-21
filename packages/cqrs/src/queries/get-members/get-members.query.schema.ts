import { z } from 'zod'

export const getMembersQuerySchema = z.object({
  q: z.string().min(1).optional(),
})
