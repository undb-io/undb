import { rolesWithoutOwner } from '@undb/authz'
import { userIdSchema } from '@undb/core'
import { emailSchema } from '@undb/domain'
import { z } from 'zod'
import { inviteIdSchema } from './invitation-id.vo.js'
import { invitationStatus } from './value-objects/index.js'

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
  status: invitationStatus,
  invitedBy: userIdSchema,
  cancelledBy: userIdSchema.optional(),
})

export type IQueryInvitation = z.infer<typeof queryInivtation>
