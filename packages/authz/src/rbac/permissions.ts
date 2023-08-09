import { z } from 'zod'
import { RBACHasNotPermission } from './rbac.errors.js'
import type { IRoles } from './role.vo.js'

export const tableActions = z.enum(['table:create', 'table:export'])
export const recordActions = z.enum(['record:create', 'record:update', 'record:delete'])

export type PermissionAction = z.infer<typeof tableActions | typeof recordActions>

export const permissions: Record<IRoles, Record<PermissionAction, boolean>> = {
  owner: {
    'table:create': true,
    'table:export': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
  },
  admin: {
    'table:create': true,
    'table:export': true,
    'record:create': true,
    'record:delete': true,
    'record:update': true,
  },
  viewer: {
    'table:create': false,
    'table:export': true,
    'record:create': false,
    'record:delete': false,
    'record:update': false,
  },
}

export const hasPermission = (role: IRoles, action: PermissionAction) => {
  if (!role) return false
  return !!permissions[role]?.[action]
}

export const checkPermission = (role: IRoles, action: PermissionAction) => {
  const has = hasPermission(role, action)
  if (!has) throw new RBACHasNotPermission(role, action)
}

export const checkPermissions = (role: IRoles, actions: PermissionAction[]) => {
  for (const action of actions) {
    checkPermission(role, action)
  }
}
