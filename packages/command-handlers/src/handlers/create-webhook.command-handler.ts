import { CreateWebhookCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { WebhookFactory, injectWebhookRepository, type IWebhookRepository } from "@undb/webhook"

@commandHandler(CreateWebhookCommand)
@singleton()
export class CreateWebhookCommandHandler implements ICommandHandler<CreateWebhookCommand, any> {
  constructor(
    @injectWebhookRepository()
    private readonly repository: IWebhookRepository,
  ) {}

  async execute(command: CreateWebhookCommand): Promise<any> {
    const webhook = WebhookFactory.from(command.input)
    await this.repository.insert(webhook)

    return webhook.id.value
  }
}
