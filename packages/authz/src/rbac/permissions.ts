import { z } from 'zod'
import { RBACHasNotPermission } from './rbac.errors.js'
import type { IRoles } from './role.vo.js'

export const tableActions = z.enum([
  'table:create',
  'table:delete',
  'table:export',
  'table:create_field',
  'table:duplicate_field',
  'table:delete_field',
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
    'table:export': true,
    'table:delete': true,
    'table:create_field': true,
    'table:duplicate_field': true,
    'table:delete_field': true,
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
    'table:delete': true,
    'table:create_field': true,
    'table:duplicate_field': true,
    'table:delete_field': true,
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
    'table:export': true,
    'table:delete': false,
    'table:create_field': false,
    'table:duplicate_field': false,
    'table:delete_field': false,
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
