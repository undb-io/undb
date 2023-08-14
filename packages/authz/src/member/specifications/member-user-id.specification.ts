import type { User } from '@undb/core'
import { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IMemberVisitor } from '../interface.js'
import type { Member } from '../member.js'
import { MemberUserProfile } from '../value-objects/member-user-profile.vo.js'

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

export class WithMemberUserProfile extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly profile: MemberUserProfile) {
    super()
  }
  public static fromUser(user: User) {
    return new this(MemberUserProfile.fromUser(user))
  }
  isSatisfiedBy(t: Member): boolean {
    return this.profile.equals(t.userProfile)
  }
  mutate(t: Member): Result<Member, string> {
    t.userProfile = this.profile
    return Ok(t)
  }
  accept(v: IMemberVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
