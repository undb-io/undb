import { z } from "@undb/zod"
import { spaceMemberRole } from "../space-member"
import { spaceActions } from "../space-member/space-action"
import { spacePermission } from "../space-member/space-permission"

const checkPermissionInput = z.object({
  role: spaceMemberRole,
  action: spaceActions,
})

type ICheckPermissionInput = z.infer<typeof checkPermissionInput>

export function getHasPermission(input: ICheckPermissionInput): boolean {
  return spacePermission[input.role][input.action]
}
