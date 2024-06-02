import type {
  Audit,
  IAuditSpecVisitor,
  WithAuditAfter,
  WithAuditDetail,
  WithAuditId,
  WithAuditOp,
  WithAuditOperator,
  WithAuditTableId,
  WithAuditTimestamp,
} from "@undb/audit"
import type { WithAuditRecordId } from "@undb/audit/src/specifications/audit-record-id.specification"
import { eq } from "drizzle-orm"
import { AbstractDBFilterVisitor } from "../abstract-db.visitor"
import { audit } from "../tables"

export class AuditFilterVisitor extends AbstractDBFilterVisitor<Audit> implements IAuditSpecVisitor {
  idEqual(s: WithAuditId): void {
    throw new Error("Method not implemented.")
  }
  timestampEqual(s: WithAuditTimestamp): void {
    throw new Error("Method not implemented.")
  }
  op(s: WithAuditOp): void {
    throw new Error("Method not implemented.")
  }
  operatorEqual(s: WithAuditOperator): void {
    throw new Error("Method not implemented.")
  }
  detailEqual(s: WithAuditDetail): void {
    throw new Error("Method not implemented.")
  }
  tableIdEqual(s: WithAuditTableId): void {
    throw new Error("Method not implemented.")
  }
  recordIdEqual(s: WithAuditRecordId): void {
    this.addCond(eq(audit.recordId, s.recordId.value))
  }
  after(s: WithAuditAfter): void {
    throw new Error("Method not implemented.")
  }
}
