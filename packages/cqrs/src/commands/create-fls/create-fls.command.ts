import type { FLSPolicyInterface, ISubject } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateFLSCommandInput } from './create-fls.command.interface.js'

export class CreateFLSCommand extends Command implements ICreateFLSCommandInput {
  public readonly tableId: string
  public readonly fieldId: string
  public readonly policy: FLSPolicyInterface
  public readonly subjects: ISubject[]

  constructor(props: CommandProps<ICreateFLSCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.fieldId = props.fieldId
    this.policy = props.policy
    this.subjects = props.subjects
  }
}
