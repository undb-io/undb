import { Provider } from '@nestjs/common'
import { AUDIT_REPOSITORY, NestAuditSqliteRepository } from './audit-sqlite.repository.js'

export const adapters: Provider[] = [
  {
    provide: AUDIT_REPOSITORY,
    useClass: NestAuditSqliteRepository,
  },
]
