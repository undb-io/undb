import type { IRoles } from '@undb/authz'
import { checkPermissions, type PermissionAction } from '@undb/authz'
import { middleware } from '../trpc.js'

export const authz = (...permissions: PermissionAction[]) =>
  middleware(({ ctx, next }) => {
    const role = ctx.get('member.role') as IRoles
    checkPermissions(role, permissions)
    return next()
  })
