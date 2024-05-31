import { UpdateWebhookCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectWebhookRepository, type IWebhookRepository } from "@undb/webhook"

@commandHandler(UpdateWebhookCommand)
@singleton()
export class UpdateWebhookCommandHandler implements ICommandHandler<UpdateWebhookCommand, any> {
  constructor(
    @injectWebhookRepository()
    private readonly repository: IWebhookRepository,
  ) {}

  async execute(command: UpdateWebhookCommand): Promise<any> {
    const webhook = (await this.repository.findOneById(command.input.id)).expect("Webhook not found")

    const spec = webhook.$updateWebhook(command.input)

    if (spec.isNone()) {
      return webhook.id.value
    }
    await this.repository.updateOneById(webhook, spec.unwrap())

    return webhook.id.value
  }
}
