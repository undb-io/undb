import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  IWebhookSpecVisitor,
  WithWebhookEnabled,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookTarget,
  WithWebhookURL,
} from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteQueryVisitor implements IWebhookSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<Webhook>) {}
  idEqual(s: WithWebhookId): void {
    const idFieldName = this.em.getMetadata().get(Webhook.name).properties.id.fieldNames[0]
    this.qb.where({ [idFieldName]: s.webhookId.value })
  }
  urlEqual(s: WithWebhookURL): void {
    const urlFieldName = this.em.getMetadata().get(Webhook.name).properties.url.fieldNames[0]
    this.qb.where({ [urlFieldName]: s.webhookURL.unpack() })
  }
  methodEqual(s: WithWebhookMethod): void {
    const methodFieldName = this.em.getMetadata().get(Webhook.name).properties.method.fieldNames[0]
    this.qb.where({ [methodFieldName]: s.webhookMethod.unpack() })
  }

  targetEqual(s: WithWebhookTarget): void {
    const {
      properties: { targetId, targetType, events },
    } = this.em.getMetadata().get(Webhook.name)
    const target = s.webhookTarget
    this.qb.where({
      [targetId.fieldNames[0]]: target?.id ?? null,
      [targetType.fieldNames[0]]: target?.type ?? null,
      [events.fieldNames[0]]: target?.events ? [target.events] : [],
    })
  }
  enabled(s: WithWebhookEnabled): void {
    const enabledFieldName = this.em.getMetadata().get(Webhook.name).properties.enabled.fieldNames[0]
    this.qb.where({ [enabledFieldName]: s.enabled })
  }

  or(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }
}
