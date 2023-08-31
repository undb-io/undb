import type { ISubject, RLSPolicyInterface } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateRLSCommandInput } from './create-rls.command.interface.js'

export class CreateRLSCommand extends Command implements ICreateRLSCommandInput {
  public readonly tableId: string
  public readonly policy: RLSPolicyInterface
  public readonly subjects: ISubject[]

  constructor(props: CommandProps<ICreateRLSCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.policy = props.policy
    this.subjects = props.subjects ?? []
  }
}
