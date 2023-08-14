import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICancelInvitationCommandInput } from './cancel-invitation.command.interface.js'

export class CancelInvitationCommand extends Command implements ICancelInvitationCommandInput {
  public readonly id: string

  constructor(props: CommandProps<ICancelInvitationCommandInput>) {
    super(props)

    this.id = props.id
  }
}
