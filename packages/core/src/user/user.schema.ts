import { z } from 'zod'

export const queryUser = z
  .object({
    userId: z.string(),
    username: z.string(),
    email: z.string().email(),
  })
  .strict()
