import { z } from "@undb/zod"
import { invitationId } from "../invitation.do"

export const deleteInvitationDTO = z.object({
  id: invitationId,
})

export type DeleteInvitationDTO = z.infer<typeof deleteInvitationDTO>
