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
  'table:update_view',
  'table:delete_view',
  'table:duplicate_view',
  'table:create_form',
  'table:update_form',
])
export const recordActions = z.enum(['record:create', 'record:update', 'record:delete'])
export const webhookActions = z.enum(['webhook:create', 'webhook:delete'])
export const shareActions = z.enum(['share:create'])
export const rlsPermissionActions = z.enum(['rls:create', 'rls:update', 'rls:delete'])

export type PermissionAction = z.infer<
  typeof tableActions | typeof recordActions | typeof webhookActions | typeof rlsPermissionActions | typeof shareActions
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
    'table:update_view': true,
    'table:delete_view': true,
    'table:duplicate_view': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
    'webhook:create': true,
    'webhook:delete': true,
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
    'table:update_view': true,
    'table:delete_view': true,
    'table:duplicate_view': true,
    'table:create_form': true,
    'table:update_form': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
    'webhook:create': true,
    'webhook:delete': true,
    'rls:create': true,
    'rls:update': true,
    'rls:delete': true,
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
    'table:update_view': false,
    'table:delete_view': false,
    'table:duplicate_view': false,
    'table:create_form': false,
    'table:update_form': false,
    'record:create': false,
    'record:delete': false,
    'record:update': false,
    'webhook:create': false,
    'webhook:delete': false,
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
