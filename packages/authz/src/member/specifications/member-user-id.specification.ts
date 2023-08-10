import type { ICollaboratorProfile } from '@undb/core'
import { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok, Option } from 'oxide.ts'
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

export class WithMemberUserProfile extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly profile: ICollaboratorProfile) {
    super()
  }
  isSatisfiedBy(t: Member): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Member): Result<Member, string> {
    t.userProfile = Option(this.profile)
    return Ok(t)
  }
  accept(v: IMemberVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
