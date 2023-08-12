import { CompositeSpecification, EmailVO } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface.js'
import type { Invitation } from '../invitation.js'

export class WithInvitationEmail extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly email: EmailVO) {
    super()
  }
  static fromString(email: string) {
    return new this(EmailVO.fromString(email))
  }
  isSatisfiedBy(t: Invitation): boolean {
    return this.email.equals(t.email)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    t.email = this.email
    return Ok(t)
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.withEmail(this)
    return Ok(undefined)
  }
}
