import { CompositeSpecification } from '@undb/domain'
import { Ok, Result } from 'oxide.ts'
import { IRLSVisitor } from '../interface.js'
import { RLS } from '../rls.js'
import { RLSPolicy, type RLSPolicyInterface } from '../value-objects/rls-policy.vo.js'

export class WithRLSPolicy extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly policy: RLSPolicy) {
    super()
  }
  static from(policy: RLSPolicyInterface): WithRLSPolicy {
    return new this(new RLSPolicy(policy))
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.policy.equals(this.policy)
  }
  mutate(t: RLS): Result<RLS, string> {
    t.policy = this.policy
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSPolicy(this)
    return Ok(undefined)
  }
}
