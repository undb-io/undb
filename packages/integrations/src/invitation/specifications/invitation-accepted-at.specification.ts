import { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Ok, Some, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { AcceptedAt } from '../value-objects/accepted-at.vo.js'

export class WithInvitationAcceptedAt extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly acceptedAt: Option<AcceptedAt>) {
    super()
  }
  static none() {
    return new this(None)
  }
  static now() {
    return new this(Some(AcceptedAt.now()))
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.acceptedAt.mapOr(false, (value) => value.equals(t.acceptedAt.unwrapUnchecked()))
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.acceptedAt = this.acceptedAt
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.acceptedAt(this)
    return Ok(undefined)
  }
}
