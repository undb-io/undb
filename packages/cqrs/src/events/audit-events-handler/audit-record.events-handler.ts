import type { RecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import type { Audit, IAuditService } from '@undb/integrations'
import { AuditFactory } from '@undb/integrations'
import type { ILogger } from '@undb/logger'
import pMap, { pMapSkip } from 'p-map'

export class AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly service: IAuditService,
    protected readonly logger: ILogger,
  ) {}

  async handle(event: RecordEvents): Promise<void> {
    try {
      const audits = AuditFactory.fromRecordEvent(event)

      const mapper = async (audit: Audit) => {
        try {
          await this.service.saveAudit(audit)
        } catch (error) {
          this.logger.error(error)
          return pMapSkip
        }
      }

      await pMap(audits, mapper, { concurrency: 10 })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
