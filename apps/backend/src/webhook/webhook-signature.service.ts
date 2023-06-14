import { Injectable } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { IEvent } from '@undb/domain'
import { Webhook } from '@undb/integrations'
import crypto from 'crypto'
import { InjectWebhookConfig, webhookConfig } from '../configs/webhook.config.js'

@Injectable()
export class WebhookSignatureService {
  constructor(
    @InjectWebhookConfig()
    private readonly config: ConfigType<typeof webhookConfig>,
  ) {}

  public sign(webhook: Webhook, event: IEvent) {
    const body = webhook.constructEvent(event)
    const secret = this.config.secret ?? 'secret'

    const signature = crypto
      .createHmac('sha256', secret)
      .update('undb_' + JSON.stringify(event.timestamp.toISOString() + '.' + JSON.stringify(body)))
      .digest('hex')
    return signature
  }
}
