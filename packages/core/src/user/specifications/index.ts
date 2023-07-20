import { and } from '@undb/domain'
import type { IQueryUsersQuerySchema } from '../user.schema.js'

export * from './interface.js'
export * from './user-avatar.specification.js'
export * from './user-color.js'
export * from './user-email.specification.js'
export * from './user-id.specification.js'
export * from './user-password.specification.js'
export * from './username.specification.js'

import { isString } from 'lodash-es'
import type { UserSpecification } from './interface.js'
import { WithUserId, WithUserIds } from './user-id.specification.js'

export const queryUsersSpec = (query: IQueryUsersQuerySchema) => {
  const specs: UserSpecification[] = []
  if (isString(query.id)) {
    specs.push(WithUserId.fromString(query.id))
  }
  if (query.ids?.length) {
    specs.push(WithUserIds.fromStrings(query.ids))
  }

  return and(...specs)
}
