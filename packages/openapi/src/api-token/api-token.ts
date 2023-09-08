import type { ApiTokenID } from './value-objects/index.js'

export class ApiToken {
  id!: ApiTokenID

  static empty() {
    return new this()
  }
}
