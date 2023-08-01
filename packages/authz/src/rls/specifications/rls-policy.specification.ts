import { CompositeSpecification } from '@undb/domain'
import { Ok, Result } from 'oxide.ts'
import { IRLSVisitor } from '../interface.js'
import { RLS } from '../rls.js'
import { RLSPolicies } from '../value-objects/rls-policies.vo.js'

export class WithRLSPolicies extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly policies: RLSPolicies) {
    super()
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.policies.equals(this.policies)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.policies = this.policies
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSPolicies(this)
    return Ok(undefined)
  }
}
