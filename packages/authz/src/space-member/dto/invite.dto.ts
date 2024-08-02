import { spaceIdSchema } from "@undb/space"
import { z } from "@undb/zod"
import { spaceMemberWithoutOwner } from "../space-member"

export const inviteDTO = z.object({
  email: z.string().email(),
  role: spaceMemberWithoutOwner.optional(),
  inviterId: z.string(),
  spaceId: spaceIdSchema,
})

export type InviteDTO = z.infer<typeof inviteDTO>
