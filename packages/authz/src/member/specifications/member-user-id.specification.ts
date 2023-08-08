import { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IMemberVisitor } from '../interface.js'
import type { Member } from '../member.js'

export class WithMemberUserId extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly userId: UserId) {
    super()
  }
  static fromString(userId: string) {
    return new this(UserId.from(userId).unwrap())
  }
  isSatisfiedBy(t: Member): boolean {
    return this.userId.equals(t.userId)
  }
  mutate(t: Member): Result<Member, string> {
    t.userId = this.userId
    return Ok(t)
  }
  accept(v: IMemberVisitor): Result<void, string> {
    v.withMemberUserId(this)
    return Ok(undefined)
  }
}
