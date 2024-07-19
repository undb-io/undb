import { z } from "@undb/zod"
import { workspaceMemberRole } from "../workspace-member"

export const inviteDTO = z.object({
  email: z.string().email(),
  role: workspaceMemberRole.optional(),
})

export type InviteDTO = z.infer<typeof inviteDTO>
