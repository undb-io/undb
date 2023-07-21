import type { CompositeSpecification } from '@undb/domain'
import type { Audit } from '../audit.js'
import type { WithAuditId } from './audit-id.specification.js'

export interface IAuditSpecVisitor {
  idEqual(s: WithAuditId): void

  or(left: AuditSpecification, right: AuditSpecification): IAuditSpecVisitor
  not(): IAuditSpecVisitor
}

export type AuditSpecification = CompositeSpecification<Audit, IAuditSpecVisitor>
