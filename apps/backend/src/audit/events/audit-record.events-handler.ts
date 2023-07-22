import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { RecordEvents, RecordEventsClasses } from '@undb/core'
import { AuditRecordEventsHandler } from '@undb/cqrs'
import type { IAuditRepository } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectAuditRepository } from '../adapters/audit-sqlite.repository.js'

@EventsHandler(...RecordEventsClasses)
export class NestAuditRecordEventsHandler extends AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    @InjectAuditRepository()
    protected readonly repo: IAuditRepository,
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
  ) {
    super(repo, logger)
  }
}
