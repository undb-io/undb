import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { WebhookFactory, type IWebhookRepository } from '@undb/integrations'
import type { ICreateWebhookCommandOutput } from './create-webhook.command.interface.js'
import type { CreateWebhookCommand } from './create-webhook.command.js'

type ICreateWebhookCommandHandler = ICommandHandler<CreateWebhookCommand, ICreateWebhookCommandOutput>

export class CreateWebhookCommandHandler implements ICreateWebhookCommandHandler {
  constructor(
    protected readonly tableRepo: ITableRepository,
    protected readonly webhookRepo: IWebhookRepository,
  ) {}

  async execute(command: CreateWebhookCommand): Promise<ICreateWebhookCommandOutput> {
    ;(await this.tableRepo.findOneById(command.tableId)).unwrap()

    const webhook = WebhookFactory.from(command.webhook)
    await this.webhookRepo.insert(webhook)

    return { id: webhook.id.value }
  }
}
