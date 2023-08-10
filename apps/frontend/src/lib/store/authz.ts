import { getHasPermission, type PermissionAction } from '@undb/authz'
import { derived } from 'svelte/store'
import { role } from './me'

export const hasPermission = derived(
	role,
	($role) => (permission: PermissionAction) => getHasPermission($role, permission),
)
