import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteWebhookCommandInput } from './delete-webhook.command.interface.js'

export class DeleteWebhookCommand extends Command implements IDeleteWebhookCommandInput {
  public readonly webhookId: string

  constructor(props: CommandProps<IDeleteWebhookCommandInput>) {
    super(props)
    this.webhookId = props.webhookId
  }
}
