import { DeleteWebhookCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectWebhookRepository, type IWebhookRepository } from "@undb/webhook"

@commandHandler(DeleteWebhookCommand)
@singleton()
export class DeleteWebhookCommandHandler implements ICommandHandler<DeleteWebhookCommand, any> {
  constructor(
    @injectWebhookRepository()
    private readonly repository: IWebhookRepository,
  ) {}

  async execute(command: DeleteWebhookCommand): Promise<any> {
    await this.repository.deleteOneById(command.input.id)

    return command.input.id
  }
}
