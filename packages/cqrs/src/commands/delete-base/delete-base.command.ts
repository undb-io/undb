import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteBaseCommandInput } from './delete-base.command.interface.js'

export class DeleteBaseCommand extends Command implements IDeleteBaseCommandInput {
  public readonly id: string

  constructor(props: CommandProps<IDeleteBaseCommandInput>) {
    super(props)
    this.id = props.id
  }
}
