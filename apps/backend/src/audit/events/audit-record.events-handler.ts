import type { IEventHandler } from '@nestjs/cqrs'
import { EventsHandler } from '@nestjs/cqrs'
import type { ClsStore, RecordEvents } from '@undb/core'
import { RecordEventsClasses, isAnonymous } from '@undb/core'
import { AuditRecordEventsHandler } from '@undb/cqrs'
import { ClsService } from 'nestjs-cls'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { NestAuditService } from '../audit.service.js'

@EventsHandler(...RecordEventsClasses)
export class NestAuditRecordEventsHandler extends AuditRecordEventsHandler implements IEventHandler<RecordEvents> {
  constructor(
    protected readonly service: NestAuditService,
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
    protected readonly cls: ClsService<ClsStore>,
  ) {
    super(service, logger)
  }

  async handle(event: RecordEvents): Promise<void> {
    await this.cls.run(async () => {
      this.cls.set('user.userId', event.operatorId)
      this.cls.set('user.isAnonymous', isAnonymous(event.operatorId))
      await super.handle(event)
    })
  }
}
