import { ExceptionBase } from '@undb/domain'
import type { PermissionAction } from './permissions.js'
import type { IRoles } from './role.vo.js'

export class RBACHasNotPermission extends ExceptionBase {
  code = 'RBAC.HAS_NOT_PERMIMSSION'

  constructor(role: IRoles, action: PermissionAction) {
    super(`${role} has not permission to perform ${action}`)
  }
}
