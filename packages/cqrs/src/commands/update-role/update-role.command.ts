import type { IRolesWithoutOwner } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateRoleCommandInput } from './update-role.command.input.js'

export class UpdateRoleCommand extends Command implements IUpdateRoleCommandInput {
  readonly memberId: string
  readonly role: IRolesWithoutOwner

  constructor(props: CommandProps<IUpdateRoleCommandInput>) {
    super(props)
    this.memberId = props.memberId
    this.role = props.role
  }
}
