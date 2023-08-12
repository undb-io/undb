import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISendInvitationMailCommandInput } from './send-invitation-mail.command.interface.js'

export class SendInvitationMailCommand extends Command implements ISendInvitationMailCommandInput {
  public readonly id: string

  constructor(props: CommandProps<ISendInvitationMailCommandInput>) {
    super(props)

    this.id = props.id
  }
}
