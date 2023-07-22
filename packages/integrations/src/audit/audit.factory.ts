import type { RecordEvents } from '@undb/core'
import { and } from '@undb/domain'
import { Audit } from './audit.js'
import { WithAuditOp } from './specifications/audit-op.specification.js'
import { WithAuditId, WithAuditTimestamp, type AuditSpecification } from './specifications/index.js'

export class AuditFactory {
  static create(...specs: AuditSpecification[]): Audit {
    return and(...specs)
      .unwrap()
      .mutate(Audit.empty())
      .unwrap()
  }

  static fromEvent(event: RecordEvents): Audit {
    const spec = and(
      WithAuditId.create(),
      WithAuditTimestamp.fromDate(event.timestamp),
      new WithAuditOp(event.name),
    ).unwrap()

    const audit = this.create(spec)
    spec.mutate(audit)
    return audit
  }
}
