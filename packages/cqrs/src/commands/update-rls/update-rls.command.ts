import type { ISubject, RLSPolicyInterface } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateRLSCommandInput } from './update-rls.command.interface.js'

export class UpdateRLSCommand extends Command implements IUpdateRLSCommandInput {
  public readonly id: string
  public readonly policy?: Partial<RLSPolicyInterface>
  public readonly subjects: ISubject[]

  constructor(props: CommandProps<IUpdateRLSCommandInput>) {
    super(props)
    this.id = props.id
    this.policy = props.policy
    this.subjects = props.subjects
  }
}
