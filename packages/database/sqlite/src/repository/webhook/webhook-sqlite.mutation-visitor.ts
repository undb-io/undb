import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type { IWebhookSpecVisitor, WithWebhookId, WithWebhookURL } from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMutationVisitor implements IWebhookSpecVisitor {
  constructor(private readonly webhookId: string, private readonly em: EntityManager) {}
  idEqual(s: WithWebhookId): void {
    throw new Error('not implemented')
  }

  urlEqual(s: WithWebhookURL): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ url: s.webhookURL.unpack() })
    this.em.persist(webhook)
  }

  or(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }
}
