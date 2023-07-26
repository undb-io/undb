import { EntityManager, QueryBuilder } from '@mikro-orm/better-sqlite'
import type {
  IWebhookSpecVisitor,
  WebhookEventsIn,
  WithWebhookEnabled,
  WithWebhookEvent,
  WithWebhookFilter,
  WithWebhookHeaders,
  WithWebhookId,
  WithWebhookMethod,
  WithWebhookName,
  WithWebhookTable,
  WithWebhookTarget,
  WithWebhookURL,
} from '@undb/integrations'
import { Webhook } from '../../entity/webhook.js'

export class WebhookSqliteQueryVisitor implements IWebhookSpecVisitor {
  constructor(
    private readonly em: EntityManager,
    private qb: QueryBuilder<Webhook>,
  ) {}
  headersEqual(s: WithWebhookHeaders): void {
    throw new Error('Method not implemented.')
  }
  eventEqual(s: WithWebhookEvent): void {
    const eventFieldName = this.em.getMetadata().get(Webhook.name).properties.event.fieldNames[0]
    this.qb.andWhere({ [eventFieldName]: s.event })
  }
  idEqual(s: WithWebhookId): void {
    const idFieldName = this.em.getMetadata().get(Webhook.name).properties.id.fieldNames[0]
    this.qb.andWhere({ [idFieldName]: s.webhookId.value })
  }
  urlEqual(s: WithWebhookURL): void {
    const urlFieldName = this.em.getMetadata().get(Webhook.name).properties.url.fieldNames[0]
    this.qb.andWhere({ [urlFieldName]: s.webhookURL.unpack() })
  }
  nameEqual(s: WithWebhookName): void {
    const nameFieldName = this.em.getMetadata().get(Webhook.name).properties.name.fieldNames[0]
    this.qb.andWhere({ [nameFieldName]: s.name })
  }
  methodEqual(s: WithWebhookMethod): void {
    const methodFieldName = this.em.getMetadata().get(Webhook.name).properties.method.fieldNames[0]
    this.qb.andWhere({ [methodFieldName]: s.webhookMethod.unpack() })
  }

  filterEqual(s: WithWebhookFilter): void {
    throw new Error('Method not implemented.')
  }

  targetEqual(s: WithWebhookTarget): void {
    const {
      properties: { targetId, targetType, event },
    } = this.em.getMetadata().get(Webhook.name)
    const target = s.webhookTarget
    this.qb.andWhere({
      [targetId.fieldNames[0]]: target?.id ?? null,
      [targetType.fieldNames[0]]: target?.type ?? null,
      [event.fieldNames[0]]: target?.event ?? null,
    })
  }
  targetTable(s: WithWebhookTable): void {
    const {
      properties: { targetId, targetType },
    } = this.em.getMetadata().get(Webhook.name)
    this.qb.andWhere({
      [targetId.fieldNames[0]]: s.tableId,
      [targetType.fieldNames[0]]: 'table',
    })
  }
  eventsIn(s: WebhookEventsIn): void {
    this.qb.andWhere({ event: { $in: s.events } })
  }
  enabled(s: WithWebhookEnabled): void {
    const enabledFieldName = this.em.getMetadata().get(Webhook.name).properties.enabled.fieldNames[0]
    this.qb.andWhere({ [enabledFieldName]: s.enabled })
  }

  or(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }

  not(): IWebhookSpecVisitor {
    throw new Error('not implemented')
  }
}
