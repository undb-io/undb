import { getHasPermission, type ISpaceMemberRole, type IWorkspaceAction } from "@undb/authz"
import { derived, writable } from "svelte/store"

export const role = writable<ISpaceMemberRole | null>(null)

export const hasPermission = derived(
  role,
  ($role) => (action: IWorkspaceAction) => !!$role && getHasPermission({ role: $role, action }),
)
