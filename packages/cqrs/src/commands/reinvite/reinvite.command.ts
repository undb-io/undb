import type { IRolesWithoutOwner } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IReInviteCommandInput } from './reinvite.command.interface.js'

export class ReInviteCommand extends Command implements IReInviteCommandInput {
  public readonly id: string
  public readonly role: IRolesWithoutOwner

  constructor(props: CommandProps<IReInviteCommandInput>) {
    super(props)

    this.id = props.id
    this.role = props.role
  }
}
