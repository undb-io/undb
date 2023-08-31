import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteFLSCommandInput } from './delete-fls.command.interface.js'

export class DeleteFLSCommand extends Command implements IDeleteFLSCommandInput {
  public readonly id: string

  constructor(props: CommandProps<IDeleteFLSCommandInput>) {
    super(props)
    this.id = props.id
  }
}
