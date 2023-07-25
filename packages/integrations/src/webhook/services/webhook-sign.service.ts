import type { IEvent } from '@undb/domain'
import type { Webhook } from '../webhook.js'

export interface IWebhookSignService {
  sign(webhook: Webhook, event: IEvent): string
}
