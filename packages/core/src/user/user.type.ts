import type { z } from 'zod'
import type { queryUser, unsafeCreateUserSchema } from './user.schema'

export type IQueryUser = z.infer<typeof queryUser>

export type IUnsafeCreateUser = z.infer<typeof unsafeCreateUserSchema>
