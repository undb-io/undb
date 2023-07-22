import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type AuditSpecification } from '@undb/integrations'
import { AuditSqliteQueryModel } from '@undb/sqlite'

export const AUDIT_QUERY_MODEL = Symbol('AUDIT_QUERY_MODEL')

export const InjectAuditQueryModel = () => Inject(AUDIT_QUERY_MODEL)

@Injectable()
export class NestAuditSqliteQueryModel extends AuditSqliteQueryModel {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @UseRequestContext()
  find(spec: AuditSpecification) {
    return super.find(spec)
  }
}
