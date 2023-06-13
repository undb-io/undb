import type { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type { IWebhookSpecVisitor, WithWebhookId, WithWebhookURL } from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteQueryVisitor implements IWebhookSpecVisitor {
  constructor(private readonly em: EntityManager, private qb: QueryBuilder<Webhook>) {}
  idEqual(s: WithWebhookId): void {
    const idFieldName = this.em.getMetadata().get(Webhook.name).properties.id.fieldNames[0]
    this.qb.where({ [idFieldName]: s.webhookId.value })
  }
  urlEqual(s: WithWebhookURL): void {
    const urlFieldName = this.em.getMetadata().get(Webhook.name).properties.id.fieldNames[0]
    this.qb.where({ [urlFieldName]: s.webhookURL.unpack() })
  }

  or(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }
}
