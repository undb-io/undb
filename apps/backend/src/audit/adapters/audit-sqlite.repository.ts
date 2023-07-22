import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject } from '@nestjs/common'
import { Audit } from '@undb/integrations'
import { AuditSqliteRepository } from '@undb/sqlite'

export const AUDIT_REPOSITORY = Symbol('AUDIT_REPOSITORY')

export const InjectAuditRepository = () => Inject(AUDIT_REPOSITORY)

export class NestAuditSqliteRepository extends AuditSqliteRepository {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  insert(audit: Audit): Promise<void> {
    return super.insert(audit)
  }
}
