import { EntityManager } from '@mikro-orm/better-sqlite'
import { MikroORM, UseRequestContext } from '@mikro-orm/core'
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

  @UseRequestContext()
  find(spec: WebhookSpecification): Promise<Webhook[]> {
    return super.find(spec)
  }

  @UseRequestContext()
  async findOneById(id: string): Promise<Option<Webhook>> {
    return super.findOneById(id)
  }

  @UseRequestContext()
  async findOne(spec: WebhookSpecification): Promise<Option<Webhook>> {
    return super.findOne(spec)
  }

  @UseRequestContext()
  async insert(table: Webhook): Promise<void> {
    return super.insert(table)
  }

  @UseRequestContext()
  async updateOneById(id: string, spec: WebhookSpecification): Promise<void> {
    return super.updateOneById(id, spec)
  }

  @UseRequestContext()
  async deleteOneById(id: string): Promise<void> {
    return super.deleteOneById(id)
  }
}
