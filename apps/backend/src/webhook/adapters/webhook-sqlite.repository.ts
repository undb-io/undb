import { EntityManager } from '@mikro-orm/better-sqlite'
import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import { type Webhook, type WebhookSpecification } from '@undb/integrations'
import { WebhookSqliteRepository } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const WEBHOOK_REPOSITORY = Symbol('WEBHOOK_REPOSITORY')
export const InjectWebhookRepository = () => Inject(WEBHOOK_REPOSITORY)

@Injectable()
export class NestWebhookSqliteRepository extends WebhookSqliteRepository {
  constructor(
    public readonly orm: MikroORM,
    em: EntityManager,
  ) {
    super(em)
  }

  @CreateRequestContext()
  find(spec: WebhookSpecification): Promise<Webhook[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  async findOneById(id: string): Promise<Option<Webhook>> {
    return super.findOneById(id)
  }

  @CreateRequestContext()
  async findOne(spec: WebhookSpecification): Promise<Option<Webhook>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  async insert(table: Webhook): Promise<void> {
    return super.insert(table)
  }

  @CreateRequestContext()
  async updateOneById(id: string, spec: WebhookSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @CreateRequestContext()
  async deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
