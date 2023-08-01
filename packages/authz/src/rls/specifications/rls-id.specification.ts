import { CompositeSpecification } from '@undb/domain'
import { Ok, Result } from 'oxide.ts'
import { IRLSVisitor } from '../interface.js'
import { RLS } from '../rls.js'
import { RLSID } from '../value-objects/rls-id.vo.js'

export class WithRLSId extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly id: RLSID) {
    super()
  }
  static fromString(id: string): WithRLSId {
    return new this(RLSID.from(id))
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.tableId.equals(this.id)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.tableId = this.id
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withId(this)
    return Ok(undefined)
  }
}
