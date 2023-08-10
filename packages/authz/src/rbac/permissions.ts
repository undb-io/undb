import { z } from 'zod'
import { RBACHasNotPermission } from './rbac.errors.js'
import type { IRoles } from './role.vo.js'

export const tableActions = z.enum([
  'table:create',
  'table:update',
  'table:delete',
  'table:export',
  'table:create_field',
  'table:update_field',
  'table:duplicate_field',
  'table:delete_field',
  'table:create_view',
  'table:update_view_name',
  'table:switch_view_display_type',
  'table:delete_view',
  'table:duplicate_view',
  'table:create_form',
  'table:update_form',
])
export const recordActions = z.enum(['record:create', 'record:update', 'record:delete'])
export const webhookActions = z.enum(['webhook:create', 'webhook:update', 'webhook:delete'])
export const shareActions = z.enum(['share:create'])
export const memberActions = z.enum(['member:update_role'])
export const rlsPermissionActions = z.enum(['rls:create', 'rls:update', 'rls:delete'])

export type PermissionAction = z.infer<
  | typeof tableActions
  | typeof recordActions
  | typeof webhookActions
  | typeof rlsPermissionActions
  | typeof memberActions
  | typeof shareActions
>

export const permissions: Record<IRoles, Record<PermissionAction, boolean>> = {
  owner: {
    'table:create': true,
    'table:update': true,
    'table:export': true,
    'table:delete': true,
    'table:create_field': true,
    'table:update_field': true,
    'table:duplicate_field': true,
    'table:delete_field': true,
    'table:create_form': true,
    'table:update_form': true,
    'table:create_view': true,
    'table:update_view_name': true,
    'table:switch_view_display_type': true,
    'table:delete_view': true,
    'table:duplicate_view': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
    'webhook:create': true,
    'webhook:update': true,
    'webhook:delete': true,
    'member:update_role': true,
    'rls:create': true,
    'rls:update': true,
    'rls:delete': true,
    'share:create': true,
  },
  admin: {
    'table:create': true,
    'table:export': true,
    'table:update': true,
    'table:delete': true,
    'table:create_field': true,
    'table:update_field': true,
    'table:duplicate_field': true,
    'table:delete_field': true,
    'table:create_view': true,
    'table:update_view_name': true,
    'table:switch_view_display_type': true,
    'table:delete_view': true,
    'table:duplicate_view': true,
    'table:create_form': true,
    'table:update_form': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
    'webhook:create': true,
    'webhook:update': true,
    'webhook:delete': true,
    'member:update_role': true,
    'rls:create': true,
    'rls:update': true,
    'rls:delete': true,
    'share:create': true,
  },
  editor: {
    'table:create': false,
    'table:export': true,
    'table:update': false,
    'table:delete': false,
    'table:create_field': false,
    'table:update_field': true,
    'table:duplicate_field': false,
    'table:delete_field': false,
    'table:create_view': true,
    'table:update_view_name': true,
    'table:switch_view_display_type': true,
    'table:delete_view': true,
    'table:duplicate_view': true,
    'table:create_form': true,
    'table:update_form': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
    'webhook:create': true,
    'webhook:update': true,
    'webhook:delete': true,
    'member:update_role': false,
    'rls:create': false,
    'rls:update': false,
    'rls:delete': false,
    'share:create': true,
  },
  viewer: {
    'table:create': false,
    'table:update': false,
    'table:export': true,
    'table:delete': false,
    'table:create_field': false,
    'table:update_field': true,
    'table:duplicate_field': false,
    'table:delete_field': false,
    'table:create_view': false,
    'table:update_view_name': false,
    'table:switch_view_display_type': false,
    'table:delete_view': false,
    'table:duplicate_view': false,
    'table:create_form': false,
    'table:update_form': false,
    'record:create': false,
    'record:delete': false,
    'record:update': false,
    'webhook:create': false,
    'webhook:update': false,
    'webhook:delete': false,
    'member:update_role': false,
    'rls:create': false,
    'rls:update': false,
    'rls:delete': false,
    'share:create': false,
  },
}

export const getHasPermission = (role: IRoles, action: PermissionAction) => {
  if (!role) return false
  return !!permissions[role]?.[action]
}

export const checkPermission = (role: IRoles, action: PermissionAction) => {
  const has = getHasPermission(role, action)
  if (!has) throw new RBACHasNotPermission(role, action)
}

export const checkPermissions = (role: IRoles, actions: PermissionAction[]) => {
  for (const action of actions) {
    checkPermission(role, action)
  }
}
