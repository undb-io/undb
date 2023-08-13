import { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Ok, Some, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { CancelledAt } from '../value-objects/cancelled-at.vo.js'

export class WithInvitationCancelledAt extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly cancelledAt: Option<CancelledAt>) {
    super()
  }
  static none() {
    return new this(None)
  }
  static now() {
    return new this(Some(CancelledAt.now()))
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.cancelledAt.mapOr(false, (value) => value.equals(t.cancelledAt.unwrapUnchecked()))
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.cancelledAt = this.cancelledAt
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.cancelledAt(this)
    return Ok(undefined)
  }
}
