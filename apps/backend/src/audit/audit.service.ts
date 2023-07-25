import { Injectable } from '@nestjs/common'
import { AuditService, type IAuditRepository } from '@undb/integrations'
import { InjectAuditRepository } from './adapters/audit-sqlite.repository.js'

@Injectable()
export class NestAuditService extends AuditService {
  constructor(
    @InjectAuditRepository()
    protected readonly repo: IAuditRepository,
  ) {
    super(repo)
  }
}
