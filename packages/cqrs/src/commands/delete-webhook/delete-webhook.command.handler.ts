import type { ICommandHandler } from '@undb/domain'
import { type IWebhookRepository } from '@undb/integrations'
import type { DeleteWebhookCommand } from './delete-webhook.command.js'

type IDeleteWebhookCommandHandler = ICommandHandler<DeleteWebhookCommand, void>

export class DeleteWebhookCommandHandler implements IDeleteWebhookCommandHandler {
  constructor(protected readonly webhookRepo: IWebhookRepository) {}

  async execute(command: DeleteWebhookCommand): Promise<void> {
    await this.webhookRepo.deleteOneById(command.webhookId)
  }
}
