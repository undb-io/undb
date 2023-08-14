import { rolesWithoutOwner } from '@undb/authz'
import { userIdSchema } from '@undb/core'
import { emailSchema } from '@undb/domain'
import { z } from 'zod'
import { inviteIdSchema } from './invitation-id.vo.js'
import { invitationStatus, invitationUserProfile } from './value-objects/index.js'

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
  invitedByProfile: invitationUserProfile,
  invitedAt: z.string(),
  cancelledBy: userIdSchema.optional(),
  cancelledAt: z.string().optional(),
  acceptedAt: z.string().optional(),
})

export type IQueryInvitation = z.infer<typeof queryInivtation>
