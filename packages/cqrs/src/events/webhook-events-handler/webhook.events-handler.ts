import type { IRecordEvents } from '@undb/core'
import type { IEventHandler } from '@undb/domain'
import type { ILogger } from '@undb/logger'
import type { IWebhookHttpService } from './webhook.http-service.js'

export class WebhookEventsHandler implements IEventHandler<IRecordEvents> {
  constructor(protected readonly logger: ILogger, protected readonly httpService: IWebhookHttpService) {}

  async handle(event: IRecordEvents): Promise<void> {
    this.logger.info('handling event %s of payload: %j', event.name, event.payload)
  }
}
