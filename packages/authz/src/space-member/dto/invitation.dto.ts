import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { invitationId, invitationStatus } from "../invitation.do"
import { spaceMemberWithoutOwner } from "../space-member"

export const invitationDTO = z.object({
  id: invitationId,
  email: z.string().email(),
  role: spaceMemberWithoutOwner,
  status: invitationStatus,
  spaceId: spaceIdSchema,
  invitedAt: z.date(),
  inviterId: z.string(),
})

export type InvitationDTO = z.infer<typeof invitationDTO>
