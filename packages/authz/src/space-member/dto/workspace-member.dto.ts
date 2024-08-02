import { z } from "@undb/zod"
import { memberId } from "../../member/member-id.vo"
import { spaceMemberRole } from "../space-member"

export const spaceMemberDTO = z.object({
  id: memberId,
  userId: z.string(),
  role: spaceMemberRole,
})

export type ISpaceMemberDTO = z.infer<typeof spaceMemberDTO>
