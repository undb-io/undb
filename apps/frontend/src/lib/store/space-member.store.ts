import { getHasPermission, type ISpaceAction, type ISpaceMemberRole } from "@undb/authz"
import { derived, writable } from "svelte/store"

export const role = writable<ISpaceMemberRole | null>(null)

export const hasPermission = derived(
  role,
  ($role) => (action: ISpaceAction) => !!$role && getHasPermission({ role: $role, action }),
)
