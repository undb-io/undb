import { memberIdSchema, roles } from '@undb/authz'
import { queryUser } from '@undb/core'
import { z } from 'zod'

export const getMeQueryOutput = z.object({
  me: queryUser,
  member: z.object({
    memberId: memberIdSchema,
    role: roles,
  }),
})
