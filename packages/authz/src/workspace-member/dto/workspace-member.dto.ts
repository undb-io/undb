import { z } from "@undb/zod"
import { memberId } from "../../member/member-id.vo"
import { workspaceMemberRole } from "../workspace-member"

export const workspaceMemberDTO = z.object({
  id: memberId,
  userId: z.string(),
  role: workspaceMemberRole,
})

export type IWorkspaceMemberDTO = z.infer<typeof workspaceMemberDTO>
