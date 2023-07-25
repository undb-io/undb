import { CompositeSpecification } from '@undb/domain'
import { Ok, Option, type Result } from 'oxide.ts'
import { AuditDetail } from '../audit-detail.vo.js'
import type { Audit } from '../audit.js'
import type { IAuditSpecVisitor } from './interface.js'

export class WithAuditDetail extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly detail: AuditDetail) {
    super()
  }

  public static from(detail: object | null) {
    return new this(new AuditDetail(detail === null ? { value: null } : detail))
  }

  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    t.detail = Option(this.detail)
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.detailEqual(this)
    return Ok(undefined)
  }
}
