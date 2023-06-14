import { Injectable } from '@nestjs/common'
import type { IWebhookHttpService } from '@undb/cqrs'
import type { IEvent } from '@undb/domain'
import type { Webhook } from '@undb/integrations'
import got from 'got'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class WebhookHttpService implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger(WebhookHttpService.name)
    private readonly logger: PinoLogger,
  ) {}

  async handle(webhook: Webhook, event: IEvent<object>) {
    try {
      this.logger.info(
        'handling webhook %s of url %s with event %s',
        webhook.id.value,
        webhook.url.unpack(),
        event.name,
      )

      await got(webhook.url.unpack(), {
        method: webhook.method.unpack(),
        json: event.payload,
      })
    } catch (error) {
      this.logger.error('webhook request error %j', error)
    }
  }
}
