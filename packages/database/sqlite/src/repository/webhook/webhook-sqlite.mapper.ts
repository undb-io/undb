import type { Webhook as CoreWebhook, IQueryWebhook, IWebhookMethod } from '@undb/integrations'
import { WebhookFactory } from '@undb/integrations'
import type { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMapper {
  static toQuery(webhook: Webhook): IQueryWebhook {
    return {
      id: webhook.id,
      url: webhook.url,
      enabled: webhook.enabled,
      method: webhook.method as IWebhookMethod,
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
      enabled: webhook.enabled,
      method: webhook.method as IWebhookMethod,
      target:
        webhook.targetId && webhook.targetType && webhook.events
          ? { id: webhook.targetId, type: webhook.targetType as any, events: webhook.events as any }
          : null,
    })
  }
}
