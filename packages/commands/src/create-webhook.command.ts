import { Command, type CommandProps } from "@undb/domain"
import { createWebhookDTO, type ICreateWebhookDTO } from "@undb/webhook"
import { z } from "@undb/zod"

export const createWebhookCommand = createWebhookDTO

export type ICreateWebhookCommand = z.infer<typeof createWebhookCommand>

export class CreateWebhookCommand extends Command {
  public readonly input: ICreateWebhookDTO

  constructor(props: CommandProps<ICreateWebhookDTO>) {
    super(props)
    this.input = props
  }
}
