import { z } from 'zod'
import { colorsSchema } from '../common/color'

export const queryUser = z
  .object({
    userId: z.string(),
    username: z.string(),
    email: z.string().email(),
    avatar: z.string().optional().nullable(),
    color: colorsSchema,
  })
  .strict()

export const unsafeCreateUserSchema = z.object({
  userId: z.string(),
  username: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatar: z.string().optional().nullable(),
  color: colorsSchema,
})
