import type { RLSPolicyInterface } from '@undb/authz/dist/index.js'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateRLSCommandInput } from './update-rls.command.interface.js'

export class UpdateRLSCommand extends Command implements IUpdateRLSCommandInput {
  public readonly id: string
  public readonly policy?: Partial<RLSPolicyInterface>

  constructor(props: CommandProps<IUpdateRLSCommandInput>) {
    super(props)
    this.id = props.id
    this.policy = props.policy
  }
}
