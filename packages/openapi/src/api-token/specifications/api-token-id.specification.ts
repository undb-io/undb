import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ApiToken } from '../api-token.js'
import type { IApiTokenVisitor } from '../interface.js'
import { ApiTokenID } from '../value-objects/api-token-id.vo.js'

export class WithApiTokenId extends CompositeSpecification<ApiToken, IApiTokenVisitor> {
  constructor(public readonly id: ApiTokenID) {
    super()
  }
  static fromString(id: string): WithApiTokenId {
    return new this(ApiTokenID.from(id))
  }
  static create(): WithApiTokenId {
    return new this(ApiTokenID.create())
  }
  isSatisfiedBy(t: ApiToken): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: ApiToken): Result<ApiToken, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
