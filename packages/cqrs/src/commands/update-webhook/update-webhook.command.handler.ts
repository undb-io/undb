import { type ITableRepository } from '@undb/core'
import type { ICommandHandler } from '@undb/domain'
import { type IWebhookRepository } from '@undb/integrations'
import type { UpdateWebhookCommand } from './update-webhook.command.js'

type IUpdateWebhookCommandHandler = ICommandHandler<UpdateWebhookCommand, void>

export class UpdateWebhookCommandHandler implements IUpdateWebhookCommandHandler {
  constructor(protected readonly tableRepo: ITableRepository, protected readonly webhookRepo: IWebhookRepository) {}

  async execute(command: UpdateWebhookCommand): Promise<void> {
    ;(await this.tableRepo.findOneById(command.tableId)).unwrap()

    const webhook = (await this.webhookRepo.findOneById(command.webhookId)).unwrap()
    const spec = webhook.updateWebhook(command.webhook)
    if (spec.isSome()) {
      await this.webhookRepo.updateOneById(webhook.id.value, spec.unwrap())
    }
  }
}
