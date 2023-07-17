import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { type ITableRepository } from '@undb/core'
import { UpdateWebhookCommandHandler as DomainHandler, UpdateWebhookCommand } from '@undb/cqrs'
import { type IWebhookRepository } from '@undb/integrations'
import { InjectTableRepository } from '../../core/table/adapters/sqlite/table-sqlite.repository.js'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'

@CommandHandler(UpdateWebhookCommand)
export class NestUpdateWebhookCommandHandler
  extends DomainHandler
  implements ICommandHandler<UpdateWebhookCommand, void>
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
