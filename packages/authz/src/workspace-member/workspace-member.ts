import { ValueObject } from "@undb/domain"
import { z } from "@undb/zod"
import { memberId } from "../member/member-id.vo"

export const workspaceMemberRole = z.enum(["owner", "admin", "viewer"])

export type IWorkspaceMemberRole = z.infer<typeof workspaceMemberRole>

export const workspaceMember = z.object({
  id: memberId,
  userId: z.string(),
  workspaceId: z.string(),
  role: workspaceMemberRole,
})

export type IWorkspaceMember = z.infer<typeof workspaceMember>

export class WorkspaceMember extends ValueObject<IWorkspaceMember> {
  toJSON() {
    return {
      id: this.props.id,
      role: this.props.role,
      workspaceId: this.props.workspaceId,
      userId: this.props.userId,
    }
  }
}
