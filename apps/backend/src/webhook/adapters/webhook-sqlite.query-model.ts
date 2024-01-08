import { EntityManager } from '@mikro-orm/better-sqlite'
import { CreateRequestContext, MikroORM } from '@mikro-orm/core'
import { Inject, Injectable } from '@nestjs/common'
import type { IQueryWebhook } from '@undb/integrations'
import { type WebhookSpecification } from '@undb/integrations'
import { WebhookSqliteQueryModel } from '@undb/sqlite'
import type { Option } from 'oxide.ts'

export const WEBHOOK_QUERY_MODEL = Symbol('WEBHOOK_QUERY_MODEL')
export const InjectWebhookQueryModel = () => Inject(WEBHOOK_QUERY_MODEL)

@Injectable()
export class NestWebhookSqliteQueryModel extends WebhookSqliteQueryModel {
  constructor(
    public readonly orm: MikroORM,
    public readonly em: EntityManager,
  ) {
    super(em)
  }

  @CreateRequestContext()
  find(spec: WebhookSpecification | null): Promise<IQueryWebhook[]> {
    return super.find(spec)
  }

  @CreateRequestContext()
  findOne(spec: WebhookSpecification): Promise<Option<IQueryWebhook>> {
    return super.findOne(spec)
  }

  @CreateRequestContext()
  findOneById(id: string): Promise<Option<IQueryWebhook>> {
    return super.findOneById(id)
  }
}
