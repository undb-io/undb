import type { FLSPolicyInterface } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateFLSCommandInput } from './create-fls.command.interface.js'

export class CreateFLSCommand extends Command implements ICreateFLSCommandInput {
  public readonly tableId: string
  public readonly policy: FLSPolicyInterface

  constructor(props: CommandProps<ICreateFLSCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.policy = props.policy
  }
}
