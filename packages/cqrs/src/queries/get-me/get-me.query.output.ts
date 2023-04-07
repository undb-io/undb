import { z } from 'zod'

export const getMeQueryOutput = z.object({
  me: z.object({}),
})
