import type { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'

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
