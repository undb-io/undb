import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { IRecordEvents, RecordEvents } from '@undb/core'
import { WebhookEventsHandler, type IWebhookHttpService } from '@undb/cqrs'
import { type IWebhookRepository } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'
import { InjectWebhookHttpService } from '../providers.js'

@EventsHandler(...RecordEvents)
export class NestWebhookEventHandler extends WebhookEventsHandler implements IEventHandler<IRecordEvents> {
  constructor(
    @InjectPinoLogger()
    protected readonly logger: PinoLogger,
    @InjectWebhookHttpService()
    protected readonly webhookHttpService: IWebhookHttpService,
    @InjectWebhookRepository()
    protected readonly repo: IWebhookRepository,
  ) {
    super(logger, webhookHttpService, repo)
  }
}
