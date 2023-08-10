import { memberIdSchema, updateMemberRole } from '@undb/authz'
import * as z from 'zod'

export const updateRoleCommandInput = z.object({
  memberId: memberIdSchema,
  role: updateMemberRole,
})

export type IUpdateRoleCommandInput = z.infer<typeof updateRoleCommandInput>
