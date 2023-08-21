import { CompositeSpecification } from '@undb/domain'
import type { Option } from 'oxide.ts'
import { None, Ok, Some, type Result } from 'oxide.ts'
import type { IInvitationVisitor } from '../interface'
import type { Invitation } from '../invitation.js'

export class WithInvitationQ extends CompositeSpecification<Invitation, IInvitationVisitor> {
  constructor(public readonly q: string) {
    super()
  }
  static optional(q?: string): Option<WithInvitationQ> {
    return q ? Some(new this(q)) : None
  }
  isSatisfiedBy(t: Invitation): boolean {
    return t.email.unpack().includes(this.q)
  }
  mutate(t: Invitation): Result<Invitation, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IInvitationVisitor): Result<void, string> {
    v.like(this)
    return Ok(undefined)
  }
}
