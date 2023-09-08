import { and } from '@undb/domain'
import { ApiToken } from './api-token.js'
import type { ApiTokenSpecification } from './interface.js'

export class ApiTokenFactory {
  static create(...specs: ApiTokenSpecification[]) {
    return and(...specs)
      .unwrap()
      .mutate(ApiToken.empty())
      .unwrap()
  }
}
