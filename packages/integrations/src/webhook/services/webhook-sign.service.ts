import { IEvent } from '@undb/domain'
import { Webhook } from '../webhook'

export interface IWebhookSignService {
  sign(webhook: Webhook, event: IEvent): string
}
