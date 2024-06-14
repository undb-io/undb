import { getHasPermission, type IWorkspaceAction, type IWorkspaceMemberRole } from "@undb/authz"
import { derived, writable } from "svelte/store"

export const role = writable<IWorkspaceMemberRole | null>(null)

export const hasPermission = derived(
  role,
  ($role) => (action: IWorkspaceAction) => !!$role && getHasPermission({ role: $role, action }),
)
