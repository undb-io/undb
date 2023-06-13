import type { Webhook as CoreWebhook, IQueryWebhook } from '@undb/integrations'
import { WebhookFactory } from '@undb/integrations'
import type { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMapper {
  static toQuery(webhook: Webhook): IQueryWebhook {
    return {
      id: webhook.id,
      url: webhook.url,
    }
  }

  static toDomain(webhook: Webhook): CoreWebhook {
    return WebhookFactory.unsafeCreate({
      id: webhook.id,
      url: webhook.url,
    })
  }
}
