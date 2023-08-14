import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import { InvitationId } from '../invitation-id.vo.js'
import type { Invitation } from '../invitation.js'

export class WithInvitationId extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly id: InvitationId) {
    super()
  }
  static fromString(id: string) {
    return new this(InvitationId.from(id).unwrap())
  }
  static create() {
    return new this(InvitationId.create())
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withInvitationId(this)
    return Ok(undefined)
  }
}
