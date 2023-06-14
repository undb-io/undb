import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  IWebhookSpecVisitor,
  WithWebhookEnabled,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookTarget,
  WithWebhookURL,
} from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMutationVisitor implements IWebhookSpecVisitor {
  constructor(private readonly webhookId: string, private readonly em: EntityManager) {}
  idEqual(s: WithWebhookId): void {
    throw new Error('not implemented')
  }

  targetEqual(s: WithWebhookTarget): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    const {
      properties: { targetId, targetType, events },
    } = this.em.getMetadata().get(Webhook.name)
    const target = s.webhookTarget
    wrap(webhook).assign({
      [targetId.fieldNames[0]]: target?.id ?? null,
      [targetType.fieldNames[0]]: target?.type ?? null,
      [events.fieldNames[0]]: target?.events ? [target.events] : [],
    })
  }

  urlEqual(s: WithWebhookURL): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ url: s.webhookURL.unpack() })
    this.em.persist(webhook)
  }
  methodEqual(s: WithWebhookMethod): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ method: s.webhookMethod.unpack() })
    this.em.persist(webhook)
  }

  enabled(s: WithWebhookEnabled): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ enabled: s.enabled })
    this.em.persist(webhook)
  }

  or(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }
}
