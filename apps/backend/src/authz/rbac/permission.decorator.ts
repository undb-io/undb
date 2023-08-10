import { SetMetadata } from '@nestjs/common'
import type { PermissionAction } from '@undb/authz'

export const Permissions = (...permissions: PermissionAction[]) => SetMetadata('permissions', permissions)
