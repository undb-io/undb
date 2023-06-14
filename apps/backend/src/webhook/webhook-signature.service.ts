import { Injectable } from '@nestjs/common'
import { IEvent } from '@undb/domain'
import { Webhook } from '@undb/integrations'
import crypto from 'crypto'

@Injectable()
export class WebhookSignatureService {
  public sign(webhook: Webhook, event: IEvent) {
    const body = webhook.constructEvent(event)
    const hmac = crypto.createHmac('sha256', 'secret')
    const digest = Buffer.from(
      'undb_' + hmac.update(Buffer.from(event.timestamp.toISOString() + '.' + JSON.stringify(body))).digest('hex'),
      'utf8',
    )
    return digest
  }
}
