import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  AuditSpecification,
  IAuditSpecVisitor,
  WithAuditAfter,
  WithAuditDetail,
  WithAuditId,
  WithAuditOp,
  WithAuditOperator,
  WithAuditTableId,
  WithAuditTarget,
  WithAuditTimestamp,
} from '@undb/integrations'
import { Audit } from '../../entity/audit.js'
import { BaseEntityManager } from '../base-entity-manager.js'

export class AuditSqliteMutationVisitor extends BaseEntityManager implements IAuditSpecVisitor {
  constructor(
    private readonly auditId: string,
    public readonly em: EntityManager,
  ) {
    super(em)
  }

  tableIdEqual(s: WithAuditTableId): void {
    throw new Error('Method not implemented.')
  }

  idEqual(s: WithAuditId): void {
    throw new Error('Method not implemented.')
  }
  timestampEqual(s: WithAuditTimestamp): void {
    const audit = this.em.getReference(Audit, this.auditId)
    wrap(audit).assign({ timestamp: s.timestamp.value })
    this.em.persist(audit)
  }
  op(s: WithAuditOp): void {
    throw new Error('Method not implemented.')
  }
  operatorEqual(s: WithAuditOperator): void {
    throw new Error('Method not implemented.')
  }
  targetEqual(s: WithAuditTarget): void {
    throw new Error('Method not implemented.')
  }
  detailEqual(s: WithAuditDetail): void {
    const audit = this.em.getReference(Audit, this.auditId)
    wrap(audit).assign({ detail: s.detail.unpack() })
    this.em.persist(audit)
  }
  after(s: WithAuditAfter): void {
    throw new Error('Method not implemented.')
  }
  or(left: AuditSpecification, right: AuditSpecification): IAuditSpecVisitor {
    throw new Error('Method not implemented.')
  }
  not(): IAuditSpecVisitor {
    throw new Error('Method not implemented.')
  }
}
