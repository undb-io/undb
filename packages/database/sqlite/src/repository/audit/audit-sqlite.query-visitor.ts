import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
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
import type { Audit } from '../../entity/audit.js'

export class AuditSqliteQueryVisitor implements IAuditSpecVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<Audit>,
  ) {}
  tableIdEqual(s: WithAuditTableId): void {
    throw new Error('Method not implemented.')
  }

  idEqual(s: WithAuditId): void {
    this.qb.andWhere({ id: s.auditId.value })
  }
  timestampEqual(s: WithAuditTimestamp): void {
    this.qb.andWhere({ timestamp: s.timestamp.value })
  }
  op(s: WithAuditOp): void {
    this.qb.andWhere({ op: s.op })
  }
  operatorEqual(s: WithAuditOperator): void {
    this.qb.andWhere({ operator: s.operatorId })
  }
  targetEqual(s: WithAuditTarget): void {
    this.qb.andWhere({ targetId: s.target.id, targetType: s.target.type })
  }
  detailEqual(s: WithAuditDetail): void {
    throw new Error('Method not implemented.')
  }
  after(s: WithAuditAfter): void {
    this.qb.andWhere({ timestamp: { $gt: s.timestamp.value } })
  }
  or(left: AuditSpecification, right: AuditSpecification): IAuditSpecVisitor {
    throw new Error('Method not implemented.')
  }
  not(): IAuditSpecVisitor {
    throw new Error('Method not implemented.')
  }
}
