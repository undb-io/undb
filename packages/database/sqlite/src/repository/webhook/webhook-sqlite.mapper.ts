import type { Webhook as CoreWebhook, IQueryWebhook, IWebhookMethod } from '@undb/integrations'
import { WebhookFactory } from '@undb/integrations'
import type { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMapper {
  static toQuery(webhook: Webhook): IQueryWebhook {
    return {
      id: webhook.id,
      url: webhook.url,
      name: webhook.name,
      enabled: !!webhook.enabled,
      method: webhook.method as IWebhookMethod,
      headers: webhook.headers,
      target:
        webhook.targetId && webhook.targetType && webhook.event
          ? { id: webhook.targetId, type: webhook.targetType as any, event: webhook.event as any }
          : null,
      filter: webhook.filter,
    }
  }

  static toDomain(webhook: Webhook): CoreWebhook {
    return WebhookFactory.unsafeCreate({
      id: webhook.id,
      url: webhook.url,
      name: webhook.name,
      enabled: !!webhook.enabled,
      method: webhook.method as IWebhookMethod,
      headers: webhook.headers,
      target:
        webhook.targetId && webhook.targetType && webhook.event
          ? { id: webhook.targetId, type: webhook.targetType as any, event: webhook.event as any }
          : null,
      filter: webhook.filter,
    })
  }
}
