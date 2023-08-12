import { rolesWithoutOwner } from '@undb/authz'
import { emailSchema } from '@undb/domain'
import { z } from 'zod'
import { inviteIdSchema } from './invitation-id.vo'

export const inviteSchema = z.object({
  email: emailSchema,
  role: rolesWithoutOwner,
})

export const reinviteSchema = z.object({
  role: rolesWithoutOwner,
})

export const queryInivtation = z.object({
  id: inviteIdSchema,
  email: emailSchema,
  role: rolesWithoutOwner,
  expiredAt: z.string(),
})

export type IQueryInvitation = z.infer<typeof queryInivtation>
