import { Command, type CommandProps } from "@undb/domain"
import { updateWebhookDTO, type IUpdateWebhookDTO } from "@undb/webhook"
import { z } from "@undb/zod"

export const updateWebhookCommand = updateWebhookDTO

export type IUpdateWebhookCommand = z.infer<typeof updateWebhookCommand>

export class UpdateWebhookCommand extends Command {
  public readonly input: IUpdateWebhookDTO

  constructor(props: CommandProps<IUpdateWebhookDTO>) {
    super(props)
    this.input = props
  }
}
