import { ViewId } from '@undb/core'
import { CompositeSpecification } from '@undb/domain'
import { Ok, Result } from 'oxide.ts'
import { IRLSVisitor } from '../interface.js'
import { RLS } from '../rls.js'

export class WithRLSViewId extends CompositeSpecification<RLS, IRLSVisitor> {
  constructor(public readonly viewId: ViewId) {
    super()
  }
  static fromString(tableId: string): WithRLSViewId {
    return new this(ViewId.fromString(tableId))
  }
  isSatisfiedBy(t: RLS): boolean {
    return t.viewId.equals(this.viewId)
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
