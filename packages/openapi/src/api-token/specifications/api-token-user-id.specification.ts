import { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { ApiToken } from '../api-token.js'
import type { IApiTokenVisitor } from '../interface.js'

export class WithApiTokenUserId extends CompositeSpecification<ApiToken, IApiTokenVisitor> {
  constructor(public readonly userId: UserId) {
    super()
  }
  static fromString(id: string): WithApiTokenUserId {
    return new this(UserId.from(id).unwrap())
  }
  isSatisfiedBy(t: ApiToken): boolean {
    return t.userId.equals(this.userId)
  }
  mutate(t: ApiToken): Result<ApiToken, string> {
    t.userId = this.userId
    return Ok(t)
  }
  accept(v: IApiTokenVisitor): Result<void, string> {
    v.withUserId(this)
    return Ok(undefined)
  }
}
