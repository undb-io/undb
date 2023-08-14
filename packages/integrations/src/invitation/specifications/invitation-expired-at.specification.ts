import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'
import { InvitationExpiredAt } from '../value-objects/index.js'

export class WithInvitationExpiredAt extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly expiredAt: InvitationExpiredAt) {
    super()
  }
  static fromDate(expiredAt: Date) {
    return new this(new InvitationExpiredAt(expiredAt))
  }
  static default() {
    return new this(InvitationExpiredAt.default())
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.expiredAt.equals(t.expiredAt)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.expiredAt = this.expiredAt
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.expiredAt(this)
    return Ok(undefined)
  }
}
