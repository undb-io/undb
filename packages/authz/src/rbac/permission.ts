import { z } from "@undb/zod"
import { spaceMemberRole, type ISpaceMemberRole } from "../space-member"
import { spaceActions, type ISpaceAction } from "../space-member/space-action"
import { spacePermission } from "../space-member/space-permission"

const checkPermissionInput = z.object({
  role: spaceMemberRole,
  action: spaceActions,
})

type ICheckPermissionInput = z.infer<typeof checkPermissionInput>

export function getHasPermission(input: ICheckPermissionInput): boolean {
  return spacePermission[input.role][input.action]
}

/**
 * @throws Error if permission denied
 * @param role
 * @param actions
 */
export function checkPermission(role: ISpaceMemberRole, actions: ISpaceAction[]) {
  if (!role) {
    throw new Error("Role not found")
  }
  for (const action of actions) {
    const hasPermission = getHasPermission({ role, action })
    if (!hasPermission) {
      throw new Error("Permission denied")
    }
  }
}
