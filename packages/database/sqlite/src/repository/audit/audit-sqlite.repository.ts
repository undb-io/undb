import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { AuditSpecification, Audit as CoreAudit, IAuditRepository } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Audit } from '../../entity/audit.js'
import { Table } from '../../entity/table.js'
import { User } from '../../entity/user.js'
import { AuditSqliteMapper } from './audit-sqlite.mapper.js'
import { AuditSqliteMutationVisitor } from './audit-sqlite.mutation-visitor.js'
import { AuditSqliteQueryVisitor } from './audit-sqlite.query-visitor.js'

export class AuditSqliteRepository implements IAuditRepository {
  constructor(private readonly em: EntityManager) {}

  async findOne(spec: AuditSpecification): Promise<Option<CoreAudit>> {
    const em = this.em.fork()
    const qb = em.qb(Audit)
    const visitor = new AuditSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const audit = await qb.getSingleResult()
    if (!audit) return None
    return Some(AuditSqliteMapper.toDomain(audit))
  }

  async updateOneById(id: string, spec: AuditSpecification): Promise<void> {
    const em = this.em.fork()

    const visitor = new AuditSqliteMutationVisitor(id, em)
    spec.accept(visitor)

    await visitor.commit()
  }

  async insert(audit: CoreAudit): Promise<void> {
    const em = this.em.fork()
    const { operatorId, tableId } = audit
    const user = em.getReference(User, operatorId)
    const table = tableId.isSome() ? em.getReference(Table, tableId.unwrap().value) : undefined
    const entity = new Audit(audit, user, table)
    await em.persistAndFlush(entity)
  }

  async deleteOneById(id: string): Promise<void> {
    await this.em.fork().nativeDelete(Audit, { id })
  }
}
