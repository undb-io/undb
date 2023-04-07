import * as z from 'zod'

export const getMeQuerySchema = z.object({
  me: z.object({}),
})
