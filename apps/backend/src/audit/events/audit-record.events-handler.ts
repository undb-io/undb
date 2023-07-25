import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { RecordEvents, RecordEventsClasses } from '@undb/core'
import { AuditRecordEventsHandler } from '@undb/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestAuditService } from '../audit.service.js'

@EventsHandler(...RecordEventsClasses)
export class NestAuditRecordEventsHandler extends AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly service: NestAuditService,
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
  ) {
    super(service, logger)
  }
}
