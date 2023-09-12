import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ApiToken } from '../api-token.js'
import type { IApiTokenVisitor } from '../interface.js'
import { ApiTokenToken } from '../value-objects/api-token-token.vo.js'

export class WithApiTokenToken extends CompositeSpecification<ApiToken, IApiTokenVisitor> {
  constructor(public readonly token: ApiTokenToken) {
    super()
  }
  static fromString(token: string): WithApiTokenToken {
    return new this(ApiTokenToken.fromString(token))
  }
  static create(): WithApiTokenToken {
    return new this(ApiTokenToken.create())
  }
  isSatisfiedBy(t: ApiToken): boolean {
    return t.token.equals(this.token)
  }
  mutate(t: ApiToken): Result<ApiToken, string> {
    t.token = this.token
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withToken(this)
    return Ok(undefined)
  }
}
