import { EventsHandler, IEventHandler } from '@nestjs/cqrs'
import { RecordEvents, RecordEventsClasses } from '@undb/core'
import { WebhookEventsHandler, type IWebhookHttpService } from '@undb/cqrs'
import { type IWebhookRepository } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'
import { InjectWebhookHttpService } from '../providers.js'

@EventsHandler(...RecordEventsClasses)
export class NestWebhookEventHandler extends WebhookEventsHandler implements IEventHandler<RecordEvents> {
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
