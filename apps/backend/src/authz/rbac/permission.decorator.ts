import { SetMetadata } from '@nestjs/common'
import type { Permission } from '@undb/authz'

export const Permissions = (...permissions: Permission[]) => SetMetadata('permissions', permissions)
