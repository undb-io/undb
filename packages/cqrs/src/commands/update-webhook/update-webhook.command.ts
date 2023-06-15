import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateWebhookSchema } from '@undb/integrations'
import type { IUpdateWebhookCommandInput } from './update-webhook.command.interface.js'

export class UpdateWebhookCommand extends Command implements IUpdateWebhookCommandInput {
  public readonly tableId: string
  public readonly webhookId: string
  public readonly webhook: IUpdateWebhookSchema

  constructor(props: CommandProps<IUpdateWebhookCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.webhookId = props.webhookId
    this.webhook = props.webhook
  }
}
