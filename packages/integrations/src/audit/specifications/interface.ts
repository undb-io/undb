import type { CompositeSpecification } from '@undb/domain'
import type { Audit } from '../audit.js'
import type { WithAuditId } from './audit-id.specification.js'
import type { WithAuditTimestamp } from './audit-timestamp.specification.js'

export interface IAuditSpecVisitor {
  idEqual(s: WithAuditId): void
  timestampEqual(s: WithAuditTimestamp): void

  or(left: AuditSpecification, right: AuditSpecification): IAuditSpecVisitor
  not(): IAuditSpecVisitor
}

export type AuditSpecification = CompositeSpecification<Audit, IAuditSpecVisitor>
