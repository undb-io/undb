import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { InvitationStatus } from '../value-objects/invitation-status.vo.js'

export class WithInvitationStatus extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly status: InvitationStatus) {
    super()
  }
  static pending() {
    return new this(new InvitationStatus({ value: 'pending' }))
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.status.equals(t.status)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.status = this.status
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withStatus(this)
    return Ok(undefined)
  }
}
