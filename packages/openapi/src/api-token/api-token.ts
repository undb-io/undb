import type { ApiTokenID, ApiTokenToken } from './value-objects/index.js'

export class ApiToken {
  id!: ApiTokenID
  token!: ApiTokenToken

  static empty() {
    return new this()
  }
}
