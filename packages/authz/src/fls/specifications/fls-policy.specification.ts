import type { RootFilter } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import type { FLS } from '../fls.js'
import type { IFLSVisitor } from '../interface.js'
import type { IFLSAction } from '../value-objects/fls-policy.vo.js'
import { FLSPolicy, type FLSPolicyInterface } from '../value-objects/fls-policy.vo.js'

export class WithFLSPolicy extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly policy: FLSPolicy) {
    super()
  }
  static from(policy: FLSPolicyInterface): WithFLSPolicy {
    return new this(new FLSPolicy(policy))
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.policy.equals(this.policy)
  }
  mutate(t: FLS): Result<FLS, string> {
    t.policy = this.policy
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withFLSPolicy(this)
    return Ok(undefined)
  }
}

export class WithFLSAction extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly action: IFLSAction) {
    super()
  }
  isSatisfiedBy(t: FLS): boolean {
    return t.policy.action === this.action
  }
  mutate(t: FLS): Result<FLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withFLSPolicyAction(this)
    return Ok(undefined)
  }
}

export class WithFLSActionIn extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly actions: [IFLSAction, ...IFLSAction[]]) {
    super()
  }
  isSatisfiedBy(t: FLS): boolean {
    return this.actions.includes(t.policy.action)
  }
  mutate(t: FLS): Result<FLS, string> {
    throw new Error('Method not implemented.')
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.actionsIn(this)
    return Ok(undefined)
  }
}

export class WithFLSPolicyFilter extends CompositeSpecification<FLS, IFLSVisitor> {
  constructor(public readonly filter: RootFilter) {
    super()
  }
  isSatisfiedBy(t: FLS): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: FLS): Result<FLS, string> {
    t.policy.filter = this.filter.value
    return Ok(t)
  }
  accept(v: IFLSVisitor): Result<void, string> {
    v.withFLSPolicyFilter(this)
    return Ok(undefined)
  }
}
