import type { RecordEvents } from '@undb/core'
import { and } from '@undb/domain'
import { Audit } from './audit.js'
import { WithAuditId, WithAuditTimestamp, type AuditSpecification } from './specifications/index.js'

export class AuditFactory {
  static create(...specs: AuditSpecification[]): Audit {
    return and(...specs)
      .unwrap()
      .mutate(Audit.empty())
      .unwrap()
  }

  static fromEvent(event: RecordEvents): Audit {
    const spec = and(WithAuditId.create(), WithAuditTimestamp.fromDate(event.timestamp)).unwrap()

    return this.create(spec)
  }
}
