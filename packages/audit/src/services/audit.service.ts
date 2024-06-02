import { singleton } from "@undb/di"
import type { Audit } from "../audit.js"
import { injectAuditRepository, type IAuditRepository } from "../audit.repository.js"

export interface IAuditService {
  saveAudit(audit: Audit): Promise<void>
}

@singleton()
export class AuditService {
  constructor(
    @injectAuditRepository()
    private readonly repo: IAuditRepository,
  ) {}

  async saveAudit(audit: Audit) {
    await this.repo.insert(audit)
  }
}
