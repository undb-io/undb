import { z } from "@undb/zod"
import { workspaceMemberWithoutOwner } from "../workspace-member"

export const inviteDTO = z.object({
  email: z.string().email(),
  role: workspaceMemberWithoutOwner.optional(),
  inviterId: z.string(),
})

export type InviteDTO = z.infer<typeof inviteDTO>
