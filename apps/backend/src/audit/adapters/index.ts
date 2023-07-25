import { Provider } from '@nestjs/common'
import { AUDIT_QUERY_MODEL, NestAuditSqliteQueryModel } from './audit-sqlite.query-model.js'
import { AUDIT_REPOSITORY, NestAuditSqliteRepository } from './audit-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: AUDIT_REPOSITORY,
    useClass: NestAuditSqliteRepository,
  },
  {
    provide: AUDIT_QUERY_MODEL,
    useClass: NestAuditSqliteQueryModel,
  },
]
