import { CompositeSpecification } from "@undb/domain"
import { RecordIdVO, type RecordId } from "@undb/table"
import { Ok, type Result } from "oxide.ts"
import type { Audit } from "../audit.js"
import type { IAuditSpecVisitor } from "./interface.js"

export class WithAuditRecordId extends CompositeSpecification<Audit, IAuditSpecVisitor> {
  constructor(public readonly recordId: RecordId) {
    super()
  }

  public static from(recordId: string) {
    return new this(new RecordIdVO(recordId))
  }

  isSatisfiedBy(t: Audit): boolean {
    return t.recordId.equals(this.recordId)
  }
  mutate(t: Audit): Result<Audit, string> {
    t.recordId = this.recordId
    return Ok(t)
  }
  accept(v: IAuditSpecVisitor): Result<void, string> {
    v.recordIdEqual(this)
    return Ok(undefined)
  }
}
