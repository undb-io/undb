import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { Audit, type AuditSpecification } from '@undb/integrations'
import { AuditSqliteRepository } from '@undb/sqlite'
import { Option } from 'oxide.ts'

export const AUDIT_REPOSITORY = Symbol('AUDIT_REPOSITORY')

export const InjectAuditRepository = () => Inject(AUDIT_REPOSITORY)

@Injectable()
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

  @UseRequestContext()
  findOne(spec: AuditSpecification): Promise<Option<Audit>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  updateOneById(id: string, spec: AuditSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
