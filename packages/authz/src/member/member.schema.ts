import { userIdSchema } from '@undb/core'
import { z } from 'zod'
import { roles } from '../rbac/index.js'
import { memberIdSchema, memberUserProfile } from './value-objects/index.js'

export const queryMember = z.object({
  id: memberIdSchema,
  role: roles,
  userId: userIdSchema,
  userProfile: memberUserProfile,
})

export type IQueryMember = z.infer<typeof queryMember>
