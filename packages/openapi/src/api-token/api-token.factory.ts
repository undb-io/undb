import { and } from '@undb/domain'
import { ApiToken } from './api-token.js'
import type { ApiTokenSpecification } from './interface.js'
import { WithApiTokenId } from './specifications/api-token-id.specification.js'
import { WithApiTokenToken } from './specifications/api-token-token.specification.js'
import { WithApiTokenUserId } from './specifications/api-token-user-id.specification.js'

export class ApiTokenFactory {
  static create(...specs: ApiTokenSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(ApiToken.empty())
      .unwrap()
  }

  static new(userId: string) {
    return this.create(WithApiTokenToken.create(), WithApiTokenUserId.fromString(userId), WithApiTokenId.create())
  }
}
