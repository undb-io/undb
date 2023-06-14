import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { IRecordEvents, RecordEvents } from '@undb/core'
import { WebhookEventsHandler } from '@undb/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@EventsHandler(...RecordEvents)
export class NestWebhookEventHandler extends WebhookEventsHandler implements IEventHandler<IRecordEvents> {
  constructor(@InjectPinoLogger() protected readonly logger: PinoLogger) {
    super(logger)
  }
}
