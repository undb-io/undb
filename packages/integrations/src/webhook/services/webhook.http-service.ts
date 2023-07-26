import type { IEvent } from '@undb/domain'
import type { Webhook } from '../webhook.js'

export interface IWebhookHttpService {
  send(webhook: Webhook, event: IEvent): Promise<void>
}
