import { Command, type CommandProps } from "@undb/domain"
import { deleteWebhookDTO, type IDeleteWebhookDTO } from "@undb/webhook"
import { z } from "@undb/zod"

export const deleteWebhookCommand = deleteWebhookDTO

export type IDeleteWebhookCommand = z.infer<typeof deleteWebhookCommand>

export class DeleteWebhookCommand extends Command {
  public readonly input: IDeleteWebhookDTO

  constructor(props: CommandProps<IDeleteWebhookDTO>) {
    super(props)
    this.input = props
  }
}
