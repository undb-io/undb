import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRoles } from '../../rbac/role.vo.js'
import { Role } from '../../rbac/role.vo.js'
import type { IMemberVisitor } from '../interface.js'
import type { Member } from '../member.js'

export class WithMemberRole extends CompositeSpecification<Member, IMemberVisitor> {
  constructor(public readonly role: Role) {
    super()
  }
  static from(role: IRoles) {
    return new this(new Role({ value: role }))
  }
  static owner() {
    return new this(Role.owner())
  }
  isSatisfiedBy(t: Member): boolean {
    return t.role.equals(this.role)
  }
  mutate(t: Member): Result<Member, string> {
    t.role = this.role
    return Ok(t)
  }
  accept(v: IMemberVisitor): Result<void, string> {
    v.withMemberRole(this)
    return Ok(undefined)
  }
}
