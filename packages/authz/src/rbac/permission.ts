import { z } from "@undb/zod"
import { workspaceMemberRole } from "../workspace-member"
import { workspacePermission } from "../workspace-member/workspace-permission"
import { workspaceActions } from "../workspace-member/workspace-action"

const checkPermissionInput = z.object({
  role: workspaceMemberRole,
  action: workspaceActions,
})

type ICheckPermissionInput = z.infer<typeof checkPermissionInput>

export function getHasPermission(input: ICheckPermissionInput): boolean {
  return workspacePermission[input.role][input.action]
}
