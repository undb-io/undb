import { and } from '@undb/domain'
import { Audit } from './audit.js'
import type { AuditSpecification } from './specifications/index.js'

export class AuditFactory {
  static create(...specs: AuditSpecification[]): Audit {
    return and(...specs)
      .unwrap()
      .mutate(Audit.empty())
      .unwrap()
  }
}
