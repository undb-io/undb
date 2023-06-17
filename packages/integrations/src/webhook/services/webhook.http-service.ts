import type { IEvent } from '@undb/domain'
import { Webhook } from '../webhook.js'

export interface IWebhookHttpService {
  send(webhooks: Webhook[], event: IEvent): Promise<void>
}
