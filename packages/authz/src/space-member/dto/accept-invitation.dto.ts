import { z } from "@undb/zod"
import { invitationId } from "../invitation.do"

export const acceptinvitationDTO = z.object({
  id: invitationId,
})

export type AcceptInvitationDTO = z.infer<typeof acceptinvitationDTO>
