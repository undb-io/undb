import * as z from 'zod'

export const getBasesQueryInput = z.object({
  q: z.string().optional(),
})
