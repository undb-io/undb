import { Injectable } from '@nestjs/common'
import type { IWebhookHttpService } from '@undb/cqrs'
import type { IEvent } from '@undb/domain'
import { UNDB_SIGNATURE_HEADER_NAME, type Webhook } from '@undb/integrations'
import got from 'got'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { WebhookSignatureService } from './webhook-signature.service.js'

@Injectable()
export class WebhookHttpService implements IWebhookHttpService {
  constructor(
    @InjectPinoLogger(WebhookHttpService.name)
    private readonly logger: PinoLogger,
    private readonly signatureService: WebhookSignatureService,
  ) {}

  async handle(webhook: Webhook, event: IEvent<object>) {
    try {
      this.logger.info(
        'handling webhook %s of url %s with event %s',
        webhook.id.value,
        webhook.url.unpack(),
        event.name,
      )

      const signature = this.signatureService.sign(webhook, event)

      await got(webhook.url.unpack(), {
        method: webhook.method.unpack(),
        json: webhook.constructEvent(event),
        headers: {
          ...(webhook.headers.unpack() ?? {}),
          'user-agent': 'undb - webhook',
          [UNDB_SIGNATURE_HEADER_NAME]: signature,
        },
      })
    } catch (error) {
      this.logger.error('webhook request error %j', error)
    }
  }
}
