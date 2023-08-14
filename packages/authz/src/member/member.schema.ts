import { collaboratorProfile, userIdSchema } from '@undb/core'
import { z } from 'zod'
import { roles } from '../rbac/index.js'
import { memberIdSchema } from './value-objects/index.js'

export const queryMember = z.object({
  id: memberIdSchema,
  role: roles,
  userId: userIdSchema,
  userProfile: collaboratorProfile,
})

export type IQueryMember = z.infer<typeof queryMember>
