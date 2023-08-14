import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { InvitedAt } from '../value-objects/invited-at.vo.js'

export class WithInvitationInvitedAt extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly invitedAt: InvitedAt) {
    super()
  }
  static now() {
    return new this(InvitedAt.now())
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.invitedAt.equals(t.invitedAt)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.invitedAt = this.invitedAt
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.invitedAt(this)
    return Ok(undefined)
  }
}
