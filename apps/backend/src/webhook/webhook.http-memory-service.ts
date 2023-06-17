import { Injectable } from '@nestjs/common'
import type { IEvent } from '@undb/domain'
import { type IWebhookHttpService, type Webhook } from '@undb/integrations'
import got from 'got'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import pLimit from 'p-limit'
import { WebhookSignatureService } from './webhook-signature.service.js'

@Injectable()
export class WebhooHttpMemoryService implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger(WebhooHttpMemoryService.name)
    private readonly logger: PinoLogger,
    private readonly signatureService: WebhookSignatureService,
  ) {}

  private limit = pLimit(100)

  private async sendOne(webhook: Webhook, event: IEvent<object>) {
    try {
      this.logger.info(
        'handling webhook %s of url %s with event %s',
        webhook.id.value,
        webhook.url.unpack(),
        event.name,
      )

      const signature = this.signatureService.sign(webhook, event)

      const headers = webhook.mergedHeaders(signature)

      await got(webhook.url.unpack(), {
        method: webhook.method.unpack(),
        json: webhook.constructEvent(event),
        headers,
      })
    } catch (error) {
      this.logger.error('webhook request error %j', error)
    }
  }

  async send(webhooks: Webhook[], event: IEvent<object>) {
    await Promise.all(webhooks.map((webhook) => this.limit(() => this.sendOne(webhook, event))))
  }
}
