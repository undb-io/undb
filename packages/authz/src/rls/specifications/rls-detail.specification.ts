import { CompositeSpecification } from '@undb/domain'
import { Ok, Result } from 'oxide.ts'
import { IRLSVisitor } from '../interface.js'
import { RLS } from '../rls.js'
import { RLSDetails } from '../value-objects/rls-details.vo.js'

export class WithRLSDetails extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly details: RLSDetails) {
    super()
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.details.equals(this.details)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.details = this.details
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSDetails(this)
    return Ok(undefined)
  }
}
