import { z } from 'zod'
import { colorsSchema } from '../common/color'
import { userIdSchema } from './value-objects'

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

export const getUsersQuerySchema = z
  .object({
    id: userIdSchema,
    ids: userIdSchema.array(),
  })
  .partial()

export type IQueryUsersQuerySchema = z.infer<typeof getUsersQuerySchema>
