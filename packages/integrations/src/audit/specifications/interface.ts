import type { CompositeSpecification } from '@undb/domain'
import type { Audit } from '../audit.js'
import type { WithAuditDetail } from './audit-detail.specification.js'
import type { WithAuditId } from './audit-id.specification.js'
import type { WithAuditOp } from './audit-op.specification.js'
import type { WithAuditOperator } from './audit-operaotr.specification.js'
import type { WithAuditTableId } from './audit-table-id.specification.js'
import type { WithAuditTarget } from './audit-target.specification.js'
import type { WithAuditAfter, WithAuditTimestamp } from './audit-timestamp.specification.js'

export interface IAuditSpecVisitor {
  idEqual(s: WithAuditId): void
  timestampEqual(s: WithAuditTimestamp): void
  op(s: WithAuditOp): void
  operatorEqual(s: WithAuditOperator): void
  targetEqual(s: WithAuditTarget): void
  detailEqual(s: WithAuditDetail): void
  tableIdEqual(s: WithAuditTableId): void
  after(s: WithAuditAfter): void

  or(left: AuditSpecification, right: AuditSpecification): IAuditSpecVisitor
  not(): IAuditSpecVisitor
}

export type AuditSpecification = CompositeSpecification<Audit, IAuditSpecVisitor>
