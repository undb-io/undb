import type { IEvent } from '@undb/domain'
import type { Webhook } from '../webhook.js'

export interface IWebhookHttpService {
  send(webhooks: Webhook[], event: IEvent): Promise<void>
}
