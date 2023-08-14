import { Injectable } from '@nestjs/common'
import type { RecordEvents } from '@undb/core'
import type { Webhook } from '@undb/integrations'
import { type IWebhookSignService } from '@undb/integrations'
import crypto from 'crypto'
import { InjectWebhookConfig, type WebhookConfigType } from '../configs/webhook.config.js'

@Injectable()
export class WebhookSignatureService implements IWebhookSignService {
  constructor(
    @InjectWebhookConfig()
    private readonly config: WebhookConfigType,
  ) {}

  public sign(webhook: Webhook, event: RecordEvents): string {
    const body = webhook.constructEvent(event)
    const secret = this.config.secret ?? 'secret'

    const signature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(event.timestamp.toISOString() + '.' + JSON.stringify(body)))
      .digest('hex')
    return 'undb_' + signature
  }
}
