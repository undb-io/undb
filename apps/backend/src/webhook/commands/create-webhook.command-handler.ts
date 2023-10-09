import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import type { ICreateWebhookCommandOutput } from '@undb/cqrs'
import { CreateWebhookCommand, CreateWebhookCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IWebhookRepository } from '@undb/integrations'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'

@CommandHandler(CreateWebhookCommand)
export class NestCreateWebhookCommandHandler
  extends DomainHandler
  implements ICommandHandler<CreateWebhookCommand, ICreateWebhookCommandOutput>
{
  constructor(
    @InjectTableRepository()
    protected readonly tableRepo: ITableRepository,
    @InjectWebhookRepository()
    protected readonly webhookRepo: IWebhookRepository,
  ) {
    super(tableRepo, webhookRepo)
  }
}
