import { rolesWithoutOwner } from '@undb/authz'
import { emailSchema } from '@undb/domain'
import { z } from 'zod'

export const inviteSchema = z.object({
  email: emailSchema,
  role: rolesWithoutOwner,
})
