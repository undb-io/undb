import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteRLSCommandInput } from './delete-rls.command.interface.js'

export class DeleteRLSCommand extends Command implements IDeleteRLSCommandInput {
  public readonly id: string

  constructor(props: CommandProps<IDeleteRLSCommandInput>) {
    super(props)
    this.id = props.id
  }
}
