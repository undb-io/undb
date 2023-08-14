import { Injectable } from '@nestjs/common'
import type { RecordEvents } from '@undb/core'
import { type IWebhookHttpService, type Webhook } from '@undb/integrations'
import got from 'got'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WebhookSignatureService } from './webhook-signature.service.js'

@Injectable()
export class WebhooHttpMemoryService implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger(WebhooHttpMemoryService.name)
    private readonly logger: PinoLogger,
    private readonly signatureService: WebhookSignatureService,
  ) {}

  async send(webhook: Webhook, event: RecordEvents) {
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
}
