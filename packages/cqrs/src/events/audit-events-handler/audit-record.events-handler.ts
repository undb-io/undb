import type { RecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import { AuditFactory, type IAuditRepository } from '@undb/integrations'
import type { ILogger } from '@undb/logger'

export class AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly repo: IAuditRepository,

    protected readonly logger: ILogger,
  ) {}

  async handle(event: RecordEvents): Promise<void> {
    try {
      const audits = AuditFactory.fromRecordEvent(event)
      await this.repo.insertMany(audits)
    } catch (error) {
      this.logger.error(error)
    }
  }
}
