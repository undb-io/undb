import { z } from "@undb/zod"
import { invitationId, invitationStatus } from "../invitation.do"
import { workspaceMemberWithoutOwner } from "../workspace-member"

export const invitationDTO = z.object({
  id: invitationId,
  email: z.string().email(),
  role: workspaceMemberWithoutOwner,
  status: invitationStatus,
})

export type InvitationDTO = z.infer<typeof invitationDTO>
