import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { AuditSpecification, IAuditQueryModel, IQueryAudit } from '@undb/integrations'
import { Audit } from '../../entity/audit.js'
import { AuditSqliteMapper } from './audit-sqlite.mapper.js'
import { AuditSqliteQueryVisitor } from './audit-sqlite.query-visitor.js'

export class AuditSqliteQueryModel implements IAuditQueryModel {
  constructor(private readonly em: EntityManager) {}

  async find(spec: AuditSpecification): Promise<IQueryAudit[]> {
    const qb = this.em.qb(Audit).orderBy({ timestamp: 'asc' })
    const visitor = new AuditSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const audits = await qb.getResultList()
    await this.em.populate(audits, ['operator.avatar', 'operator.username', 'operator.color'])
    return audits.map((audit) => AuditSqliteMapper.toQuery(audit))
  }
}
