import type { FLSPolicyInterface, ISubject } from '@undb/authz'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateFLSCommandInput } from './update-fls.command.interface.js'

export class UpdateFLSCommand extends Command implements IUpdateFLSCommandInput {
  public readonly id: string
  public readonly policy?: Partial<FLSPolicyInterface>
  public readonly subjects: ISubject[]

  constructor(props: CommandProps<IUpdateFLSCommandInput>) {
    super(props)
    this.id = props.id
    this.policy = props.policy
    this.subjects = props.subjects
  }
}
