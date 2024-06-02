import type { CompositeSpecification, ISpecVisitor } from "@undb/domain"
import type { Audit } from "../audit.js"
import type { WithAuditDetail } from "./audit-detail.specification.js"
import type { WithAuditId } from "./audit-id.specification.js"
import type { WithAuditOp } from "./audit-op.specification.js"
import type { WithAuditOperator } from "./audit-operaotr.specification.js"
import type { WithAuditRecordId } from "./audit-record-id.specification.js"
import type { WithAuditTableId } from "./audit-table-id.specification.js"
import type { WithAuditAfter, WithAuditTimestamp } from "./audit-timestamp.specification.js"

export interface IAuditSpecVisitor extends ISpecVisitor {
  idEqual(s: WithAuditId): void
  timestampEqual(s: WithAuditTimestamp): void
  op(s: WithAuditOp): void
  operatorEqual(s: WithAuditOperator): void
  detailEqual(s: WithAuditDetail): void
  tableIdEqual(s: WithAuditTableId): void
  recordIdEqual(s: WithAuditRecordId): void
  after(s: WithAuditAfter): void
}

export type AuditSpecification = CompositeSpecification<Audit, IAuditSpecVisitor>
