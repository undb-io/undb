import { and } from "@undb/domain"
import type { IRecordEvent } from "@undb/table"
import { Audit } from "./audit.js"
import { getAuditSpecsFromEvent } from "./specifications/audit-from-event.specification.js"
import { type AuditSpecification } from "./specifications/index.js"

export class AuditFactory {
  static create(...specs: AuditSpecification[]): Audit {
    return and(...specs)
      .unwrap()
      .mutate(Audit.empty())
      .unwrap()
  }

  static fromRecordEvent(event: IRecordEvent): Audit[] {
    const specs = getAuditSpecsFromEvent(event)
    return specs.map((spec) => {
      const audit = this.create(spec)
      spec.mutate(audit)
      return audit
    })
  }
}
