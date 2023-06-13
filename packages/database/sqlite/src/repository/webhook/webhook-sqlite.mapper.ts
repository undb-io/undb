import type { Webhook as CoreWebhook, IQueryWebhook } from '@undb/integrations'
import { WebhookFactory } from '@undb/integrations'
import type { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMapper {
  static toQuery(webhook: Webhook): IQueryWebhook {
    return {
      id: webhook.id,
      url: webhook.url,
      target:
        webhook.targetId && webhook.targetType && webhook.events
          ? { id: webhook.targetId, type: webhook.targetType as any, events: webhook.events as any }
          : null,
    }
  }

  static toDomain(webhook: Webhook): CoreWebhook {
    return WebhookFactory.unsafeCreate({
      id: webhook.id,
      url: webhook.url,
      target:
        webhook.targetId && webhook.targetType && webhook.events
          ? { id: webhook.targetId, type: webhook.targetType as any, events: webhook.events as any }
          : null,
    })
  }
}
