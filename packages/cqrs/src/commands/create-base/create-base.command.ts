import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateBaseCommandInput } from './create-base.command.interface.js'

export class CreateBaseCommand extends Command implements ICreateBaseCommandInput {
  public readonly name: string

  constructor(props: CommandProps<ICreateBaseCommandInput>) {
    super(props)
    this.name = props.name
  }
}
