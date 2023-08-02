import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRLSVisitor } from '../interface.js'
import type { RLS } from '../rls.js'
import { RLSID } from '../value-objects/rls-id.vo.js'

export class WithRLSId extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly id: RLSID) {
    super()
  }
  static fromString(id: string): WithRLSId {
    return new this(RLSID.from(id))
  }
  static create(): WithRLSId {
    return new this(RLSID.create())
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.id.equals(this.id)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.id = this.id
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
