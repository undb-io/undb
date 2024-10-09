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
import type { ExpressionBuilder } from "kysely"
import { AbstractQBVisitor } from "../abstract-qb.visitor"
import type { Database } from "../db"

export class AuditFilterVisitor extends AbstractQBVisitor<Audit> implements IAuditSpecVisitor {
  constructor(
    protected readonly eb: ExpressionBuilder<Database, "undb_audit">,
    private readonly spaceId: string,
  ) {
    super(eb)
    this.addCond(this.eb.eb("space_id", "=", spaceId))
  }
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
    const cond = this.eb.eb("record_id", "=", s.recordId.value)
    this.addCond(cond)
  }
  after(s: WithAuditAfter): void {
    throw new Error("Method not implemented.")
  }
  clone(): this {
    return new AuditFilterVisitor(this.eb, this.spaceId) as this
  }
}
