import { EntityManager } from '@mikro-orm/better-sqlite'
import { Audit as CoreAudit, IAuditRepository } from '@undb/integrations'
import { Audit } from '../../entity/audit.js'
import { Table } from '../../entity/table.js'
import { User } from '../../entity/user.js'

export class AuditSqliteRepository implements IAuditRepository {
  constructor(private readonly em: EntityManager) {}

  async insert(audit: CoreAudit): Promise<void> {
    const { operatorId, tableId } = audit
    const user = this.em.getReference(User, operatorId)
    const table = tableId.isSome() ? this.em.getReference(Table, tableId.unwrap().value) : undefined
    const entity = new Audit(audit, user, table)
    await this.em.persistAndFlush(entity)
  }

  async insertMany(audits: CoreAudit[]): Promise<void> {
    const entities = audits.map((audit) => {
      const { operatorId, tableId } = audit
      const user = this.em.getReference(User, operatorId)
      const table = tableId.isSome() ? this.em.getReference(Table, tableId.unwrap().value) : undefined
      return new Audit(audit, user, table)
    })
    await this.em.insertMany(entities)
  }
}
