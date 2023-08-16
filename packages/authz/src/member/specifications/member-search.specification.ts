import { CompositeSpecification } from '@undb/domain'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { IMemberVisitor } from '../interface.js'
import type { Member } from '../member.js'

export class WithMemberUserLike extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly q: string) {
    super()
  }
  static optional(q?: string): Option<WithMemberUserLike> {
    return q ? Some(new this(q)) : None
  }
  isSatisfiedBy(t: Member): boolean {
    return t.userProfile.profile.username.includes(this.q) || t.userProfile.profile.email.includes(this.q)
  }
  mutate(t: Member): Result<Member, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IMemberVisitor): Result<void, string> {
    v.userLike(this)
    return Ok(undefined)
  }
}
