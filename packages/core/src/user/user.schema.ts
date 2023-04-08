import { z } from 'zod'

export const queryUser = z
  .object({
    userId: z.string(),
    username: z.string(),
    email: z.string().email(),
  })
  .strict()

export const unsafeCreateUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
})
