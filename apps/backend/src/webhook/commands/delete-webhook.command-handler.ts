import type { ICommandHandler } from '@nestjs/cqrs'
import { CommandHandler } from '@nestjs/cqrs'
import { DeleteWebhookCommand, DeleteWebhookCommandHandler as DomainHandler } from '@undb/cqrs'
import { type IWebhookRepository } from '@undb/integrations'
import { InjectWebhookRepository } from '../adapters/webhook-sqlite.repository.js'

@CommandHandler(DeleteWebhookCommand)
export class NestDeleteWebhookCommandHandler
  extends DomainHandler
  implements ICommandHandler<DeleteWebhookCommand, void>
{
  constructor(
    @InjectWebhookRepository()
    protected readonly webhookRepo: IWebhookRepository,
  ) {
    super(webhookRepo)
  }
}
