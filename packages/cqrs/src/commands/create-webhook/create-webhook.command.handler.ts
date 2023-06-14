import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import type { IWebhookRepository } from '@undb/integrations'
import type { CreateWebhookCommand } from './create-webhook.command.js'

type ICreateWebhookCommandHandler = ICommandHandler<CreateWebhookCommand, void>

export class CreateWebhookCommandHandler implements ICreateWebhookCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly webhookRepo: IWebhookRepository) {}

  async execute(command: CreateWebhookCommand): Promise<void> {
    const table = (await this.tableRepo.findOneById(command.tableId)).unwrap()

    // const spec = table.createWebhook(command.view)

    // await this.tableRepo.updateOneById(table.id.value, spec)
  }
}
