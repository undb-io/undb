import type { User, UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { InvitationUserProfile } from '../value-objects/invitation-user-profile.vo.js'

export class WithInvitationInvitedBy extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly invitedBy: UserId) {
    super()
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.invitedBy.equals(t.invitedBy)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.invitedBy = this.invitedBy
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.invitedBy(this)
    return Ok(undefined)
  }
}

export class WithInvitationInvitedByProfile extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly profile: InvitationUserProfile) {
    super()
  }
  static fromUser(user: User) {
    return new this(InvitationUserProfile.fromUser(user))
  }
  isSatisfiedBy(t: Invitation): boolean {
    return t.invitedByProfile.equals(this.profile)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.invitedByProfile = this.profile
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    throw new Error('Method not implemented.')
  }
}
