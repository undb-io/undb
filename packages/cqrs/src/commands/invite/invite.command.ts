import type { IRolesWithoutOwner } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IInviteCommandInput } from './invite.command.interface.js'

export class InviteCommand extends Command implements IInviteCommandInput {
  public readonly email: string
  public readonly role: IRolesWithoutOwner

  constructor(props: CommandProps<IInviteCommandInput>) {
    super(props)

    this.email = props.email
    this.role = props.role
  }
}
