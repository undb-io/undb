import { CompositeSpecification } from '@undb/domain'
import { Ok, type Result } from 'oxide.ts'
import { AuditTarget } from '../audit-target.vo.js'
import type { Audit } from '../audit.js'
import type { IAuditSpecVisitor } from './interface.js'

export class WithAuditTarget extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly target: AuditTarget) {
    super()
  }

  static fromRecordId(recordId: string): WithAuditTarget {
    return new this(new AuditTarget({ id: recordId, type: 'record' }))
  }

  isSatisfiedBy(t: Audit): boolean {
    throw new Error('Method not implemented.')
  }
  mutate(t: Audit): Result<Audit, string> {
    t.target = this.target
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.targetEqual(this)
    return Ok(undefined)
  }
}
