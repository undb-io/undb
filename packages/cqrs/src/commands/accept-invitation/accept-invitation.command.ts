import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IAcceptInvitationCommandInput } from './accept-invitation.command.interface.js'

export class AcceptInvitationCommand extends Command implements IAcceptInvitationCommandInput {
  public readonly id: string

  constructor(props: CommandProps<IAcceptInvitationCommandInput>) {
    super(props)

    this.id = props.id
  }
}
