import type { UserId } from '@undb/core'
import type { ApiTokenID, ApiTokenToken } from './value-objects/index.js'

export class ApiToken {
  id!: ApiTokenID
  token!: ApiTokenToken
  userId!: UserId

  static empty() {
    return new this()
  }
}
