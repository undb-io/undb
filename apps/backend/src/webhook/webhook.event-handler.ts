import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { IRecordEvents, RecordEvents } from '@undb/core'
import { WebhookEventsHandler, type IWebhookHttpService } from '@undb/cqrs'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectWebhookHttpService } from './providers.js'

@EventsHandler(...RecordEvents)
export class NestWebhookEventHandler extends WebhookEventsHandler implements IEventHandler<IRecordEvents> {
  constructor(
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
    @InjectWebhookHttpService()
    protected readonly webhookHttpService: IWebhookHttpService,
  ) {
    super(logger, webhookHttpService)
  }
}
