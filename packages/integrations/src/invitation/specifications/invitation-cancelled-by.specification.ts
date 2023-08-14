import type { UserId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'

export class WithInvitationCancelledBy extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly cancelledBy: Option<UserId>) {
    super()
  }
  isSatisfiedBy(t: Invitation): boolean {
    if (this.cancelledBy.isNone()) return this.cancelledBy.isNone()
    return t.cancelledBy.mapOr(false, (value) => value.equals(this.cancelledBy.unwrap()))
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.cancelledBy = this.cancelledBy
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.cancelledBy(this)
    return Ok(undefined)
  }
}
