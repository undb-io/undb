import type { RecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import { AuditFactory, type IAuditRepository } from '@undb/integrations'

export class AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(protected readonly repo: IAuditRepository) {}

  async handle(event: RecordEvents): Promise<void> {
    const audit = AuditFactory.fromEvent(event)
    await this.repo.insert(audit)
  }
}
