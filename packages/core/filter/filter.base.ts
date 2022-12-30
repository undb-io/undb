import { z } from 'zod'

export const baseFilter = z.object({
  path: z.string().min(1),
})
