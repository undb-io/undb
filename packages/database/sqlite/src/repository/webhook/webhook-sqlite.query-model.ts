import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { IQueryWebhook, IWebhookQueryModel, WebhookSpecification } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Webhook } from '../../entity/webhook.js'
import { WebhookSqliteMapper } from './webhook-sqlite.mapper.js'
import { WebhookSqliteQueryVisitor } from './webhook-sqlite.query-visitor.js'

export class WebhookSqliteQueryModel implements IWebhookQueryModel {
  constructor(protected readonly em: EntityManager) {}

  async find(spec: WebhookSpecification | null): Promise<IQueryWebhook[]> {
    const qb = this.em.qb(Webhook)

    const visitor = new WebhookSqliteQueryVisitor(this.em, qb)
    if (spec) spec.accept(visitor)

    const webhooks = await qb.getResult()

    return webhooks.map((webhook) => WebhookSqliteMapper.toQuery(webhook))
  }

  async findOneById(id: string): Promise<Option<IQueryWebhook>> {
    const webhook = await this.em.findOne(Webhook, id)
    if (!webhook) {
      return None
    }
    return Some(WebhookSqliteMapper.toQuery(webhook))
  }

  async findOne(spec: WebhookSpecification): Promise<Option<IQueryWebhook>> {
    const qb = this.em.qb(Webhook)
    const visitor = new WebhookSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const webhook = await qb.getSingleResult()
    if (!webhook) return None

    return Some(WebhookSqliteMapper.toQuery(webhook))
  }
}
