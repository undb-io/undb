import { singleton } from "@undb/di"
import type { RecordId } from "@undb/table"
import type { Audit } from "../audit.js"
import {
  injectAuditQueryRepository,
  injectAuditRepository,
  type IAuditQueryRepository,
  type IAuditRepository,
} from "../audit.repository.js"
import type { IAuditDTO } from "../dto/audit.dto.js"
import { WithAuditRecordId } from "../specifications/audit-record-id.specification.js"
import { createLogger } from "@undb/logger"

export interface IAuditService {
  saveAudit(audit: Audit): Promise<void>
  getRecordAudits(recordId: RecordId): Promise<IAuditDTO[]>
}

@singleton()
export class AuditService implements IAuditService {
  private logger = createLogger(AuditService.name)
  constructor(
    @injectAuditRepository()
    private readonly repo: IAuditRepository,
    @injectAuditQueryRepository()
    private readonly queryRepo: IAuditQueryRepository,
  ) {}

  async saveAudit(audit: Audit) {
    this.logger.debug("Saving audit", audit)
    await this.repo.insert(audit)
  }

  async getRecordAudits(recordId: RecordId): Promise<IAuditDTO[]> {
    return this.queryRepo.find(new WithAuditRecordId(recordId))
  }
}
