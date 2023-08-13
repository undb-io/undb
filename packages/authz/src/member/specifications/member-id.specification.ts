import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IMemberVisitor } from '../interface.js'
import type { Member } from '../member.js'
import { MemberID } from '../value-objects/member-id.vo.js'

export class WithMemberId extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly id: MemberID) {
    super()
  }
  static fromString(memberId: string) {
    return new this(MemberID.from(memberId))
  }
  static create() {
    return new this(MemberID.create())
  }
  isSatisfiedBy(t: Member): boolean {
    return this.id.equals(t.id)
  }
  mutate(t: Member): Result<Member, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IMemberVisitor): Result<void, string> {
    v.withMemberId(this)
    return Ok(undefined)
  }
}
