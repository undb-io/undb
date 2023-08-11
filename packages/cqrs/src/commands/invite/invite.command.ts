import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IInviteCommandInput } from './invite.command.interface.js'

export class InviteCommand extends Command implements IInviteCommandInput {
  constructor(props: CommandProps<IInviteCommandInput>) {
    super(props)
  }
}
