import type { RootFilter } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { IRLSVisitor } from '../interface.js'
import type { RLS } from '../rls.js'
import type { IRLSAction } from '../value-objects/rls-policy.vo.js'
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

export class WithRLSAction extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly action: IRLSAction) {
    super()
  }
  static list(): WithRLSAction {
    return new this('list')
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.policy.action === this.action
  }
  mutate(t: RLS): Result<RLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSPolicyAction(this)
    return Ok(undefined)
  }
}

export class WithRLSActionIn extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly actions: [IRLSAction, ...IRLSAction[]]) {
    super()
  }
  isSatisfiedBy(t: RLS): boolean {
    return this.actions.includes(t.policy.action)
  }
  mutate(t: RLS): Result<RLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.actionsIn(this)
    return Ok(undefined)
  }
}

export class WithRLSPolicyFilter extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly filter: RootFilter) {
    super()
  }
  isSatisfiedBy(t: RLS): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: RLS): Result<RLS, string> {
    t.policy.filter = this.filter.value
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withRLSPolicyFilter(this)
    return Ok(undefined)
  }
}
