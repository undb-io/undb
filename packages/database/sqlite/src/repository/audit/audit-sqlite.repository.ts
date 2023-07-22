import { EntityManager } from '@mikro-orm/better-sqlite'
import { Audit as CoreAudit, IAuditRepository } from '@undb/integrations'
import { Audit } from '../../entity/audit.js'

export class AuditSqliteRepository implements IAuditRepository {
  constructor(private readonly em: EntityManager) {}

  async insert(audit: CoreAudit): Promise<void> {
    const entity = new Audit(audit)
    await this.em.persistAndFlush(entity)
  }

  async insertMany(audits: CoreAudit[]): Promise<void> {
    const entities = audits.map((audit) => new Audit(audit))
    await this.em.insertMany(entities)
  }
}
