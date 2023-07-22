import { EntityManager } from '@mikro-orm/better-sqlite'
import { Audit as CoreAudit, IAuditRepository } from '@undb/integrations'
import { Audit } from '../../entity/audit.js'
import { User } from '../../entity/user.js'

export class AuditSqliteRepository implements IAuditRepository {
  constructor(private readonly em: EntityManager) {}

  async insert(audit: CoreAudit): Promise<void> {
    const userId = audit.operatorId
    const user = this.em.getReference(User, userId)
    const entity = new Audit(audit, user)
    await this.em.persistAndFlush(entity)
  }

  async insertMany(audits: CoreAudit[]): Promise<void> {
    const entities = audits.map((audit) => {
      const user = this.em.getReference(User, audit.operatorId)
      return new Audit(audit, user)
    })
    await this.em.insertMany(entities)
  }
}
