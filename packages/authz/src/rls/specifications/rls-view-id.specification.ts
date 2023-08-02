import { ViewId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import type { Option, Result } from 'oxide.ts'
import { None, Ok, Some } from 'oxide.ts'
import type { IRLSVisitor } from '../interface.js'
import type { RLS } from '../rls.js'

export class WithRLSViewId extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly viewId: Option<ViewId>) {
    super()
  }
  static fromString(viewId?: string): WithRLSViewId {
    return new this(viewId ? Some(ViewId.fromString(viewId)) : None)
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.viewId.mapOr(false, (viewId) => (this.viewId.isSome() ? viewId.equals(this.viewId.unwrap()) : false))
  }
  mutate(t: RLS): Result<RLS, string> {
    t.viewId = this.viewId
    return Ok(t)
  }
  accept(v: IRLSVisitor): Result<void, string> {
    v.withViewId(this)
    return Ok(undefined)
  }
}
