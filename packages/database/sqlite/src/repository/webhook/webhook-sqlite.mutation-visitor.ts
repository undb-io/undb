import type { EntityManager } from '@mikro-orm/better-sqlite'
import { wrap } from '@mikro-orm/core'
import type {
  IWebhookSpecVisitor,
  WebhookEvent,
  WebhookEventsIn,
  WithWebhookEnabled,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTable,
  WithWebhookTarget,
  WithWebhookURL,
} from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteMutationVisitor implements IWebhookSpecVisitor {
  constructor(private readonly webhookId: string, private readonly em: EntityManager) {}
  eventEqual(s: WebhookEvent): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ event: s.event })
    this.em.persist(webhook)
  }
  idEqual(s: WithWebhookId): void {
    throw new Error('not implemented')
  }

  nameEqual(s: WithWebhookName): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    wrap(webhook).assign({ name: s.name })
    this.em.persist(webhook)
  }
  targetEqual(s: WithWebhookTarget): void {
    const webhook = this.em.getReference(Webhook, this.webhookId)
    const {
      properties: { targetId, targetType, event },
    } = this.em.getMetadata().get(Webhook.name)
    const target = s.webhookTarget
    wrap(webhook).assign({
      [targetId.fieldNames[0]]: target?.id ?? null,
      [targetType.fieldNames[0]]: target?.type ?? null,
      [event.fieldNames[0]]: target?.event ?? null,
    })
  }

  targetTable(s: WithWebhookTable): void {
    throw new Error('Method not implemented.')
  }
  eventsIn(s: WebhookEventsIn): void {
    throw new Error('Method not implemented.')
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
