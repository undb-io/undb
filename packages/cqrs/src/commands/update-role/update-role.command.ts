import type { IRoles } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateRoleCommandInput } from './update-role.command.input.js'

export class UpdateRoleCommand extends Command implements IUpdateRoleCommandInput {
  readonly memberId: string
  readonly role: IRoles

  constructor(props: CommandProps<IUpdateRoleCommandInput>) {
    super(props)
    this.memberId = props.memberId
    this.role = props.role
  }
}
