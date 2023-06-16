import type { IEvent } from '@undb/domain'
import type { Webhook } from '@undb/integrations'

export interface IWebhookHttpService {
  handle(webhook: Webhook, event: IEvent): any
}
