import { memberIdSchema, rolesWithoutOwner } from '@undb/authz'
import * as z from 'zod'

export const updateRoleCommandInput = z.object({
  memberId: memberIdSchema,
  role: rolesWithoutOwner,
})

export type IUpdateRoleCommandInput = z.infer<typeof updateRoleCommandInput>
