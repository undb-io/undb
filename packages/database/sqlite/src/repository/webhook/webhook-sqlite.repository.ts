import type { EntityManager } from '@mikro-orm/better-sqlite'
import type { Webhook as CoreWebhook, IWebhookRepository, WebhookSpecification } from '@undb/integrations'
import type { Option } from 'oxide.ts'
import { None, Some } from 'oxide.ts'
import { Webhook } from '../../entity/webhook.js'
import { WebhookSqliteMapper } from './webhook-sqlite.mapper.js'
import { WebhookSqliteMutationVisitor } from './webhook-sqlite.mutation-visitor.js'
import { WebhookSqliteQueryVisitor } from './webhook-sqlite.query-visitor.js'

export class WebhookSqliteRepository implements IWebhookRepository {
  constructor(private readonly em: EntityManager) {}
  async insert(webhook: CoreWebhook): Promise<void> {
    const entity = new Webhook(webhook)
    await this.em.persistAndFlush(entity)
  }

  async updateOneById(id: string, spec: WebhookSpecification): Promise<void> {
    const visitor = new WebhookSqliteMutationVisitor(id, this.em)
    spec.accept(visitor)

    await this.em.flush()
  }

  async find(spec: WebhookSpecification): Promise<CoreWebhook[]> {
    const em = this.em.fork()
    const qb = em.qb(Webhook)
    const visitor = new WebhookSqliteQueryVisitor(em, qb)
    spec.accept(visitor)

    const webhooks = await qb.getResult()
    return webhooks.map((webhook) => WebhookSqliteMapper.toDomain(webhook))
  }

  async findOneById(id: string): Promise<Option<CoreWebhook>> {
    const webhook = await this.em.findOne(Webhook, id)
    if (!webhook) {
      return None
    }
    return Some(WebhookSqliteMapper.toDomain(webhook))
  }

  async findOne(spec: WebhookSpecification): Promise<Option<CoreWebhook>> {
    const qb = this.em.qb(Webhook)
    const visitor = new WebhookSqliteQueryVisitor(this.em, qb)
    spec.accept(visitor)

    const webhook = await qb.getSingleResult()
    if (!webhook) return None

    return Some(WebhookSqliteMapper.toDomain(webhook))
  }

  async exists(spec: WebhookSpecification): Promise<boolean> {
    const qb = this.em.qb(Webhook)
    const visitor = new WebhookSqliteQueryVisitor(this.em, qb)

    spec.accept(visitor)

    const webhook = await qb.getSingleResult()
    return !!webhook
  }

  async deleteOneById(id: string): Promise<void> {
    await this.em.nativeDelete(Webhook, { id })
  }
}
