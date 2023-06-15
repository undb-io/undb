import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateWebhookSchema } from '@undb/integrations'
import type { ICreateWebhookCommandInput } from './create-webhook.command.interface.js'

export class CreateWebhookCommand extends Command implements ICreateWebhookCommandInput {
  public readonly tableId: string
  public readonly webhook: ICreateWebhookSchema

  constructor(props: CommandProps<ICreateWebhookCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.webhook = props.webhook
  }
}
