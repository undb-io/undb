import { getHasPermission, type ISpaceAction, type ISpaceMemberRole } from "@undb/authz"
import { derived, writable } from "svelte/store"
import { getIsPlayground } from "./playground.svelte"

export const role = writable<ISpaceMemberRole | null>(null)

export const hasPermission = derived(role, ($role) => (action: ISpaceAction) => {
  const isPlayground = getIsPlayground()
  if (isPlayground) return true
  return !!$role && getHasPermission({ role: $role, action })
})
