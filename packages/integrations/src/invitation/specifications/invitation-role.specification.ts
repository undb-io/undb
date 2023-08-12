import type { Role } from '@undb/authz'
import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'

export class WithInvitationRole extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly role: Role) {
    super()
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.role.equals(t.role)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.role = this.role
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withRole(this)
    return Ok(undefined)
  }
}
