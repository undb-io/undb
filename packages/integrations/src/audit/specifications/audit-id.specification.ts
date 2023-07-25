import { CompositeSpecification } from '@undb/domain'
import type { Result } from 'oxide.ts'
import { Ok } from 'oxide.ts'
import { AuditId } from '../audit-id.vo.js'
import type { Audit } from '../audit.js'
import type { IAuditSpecVisitor } from './interface.js'

export class WithAuditId extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly auditId: AuditId) {
    super()
  }

  static fromString(id: string): WithAuditId {
    return new WithAuditId(AuditId.from(id).unwrap())
  }

  static fromNullableString(id?: string): WithAuditId {
    return new WithAuditId(AuditId.fromOrCreate(id))
  }

  static create(): WithAuditId {
    return new WithAuditId(AuditId.create())
  }

  isSatisfiedBy(w: Audit): boolean {
    return this.auditId.equals(w.id)
  }

  mutate(w: Audit): Result<Audit, string> {
    w.id = this.auditId
    return Ok(w)
  }

  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.idEqual(this)
    return Ok(undefined)
  }
}
