import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IUpdateBaseCommandInput } from './update-base.command.interface.js'

export class UpdateBaseCommand extends Command implements IUpdateBaseCommandInput {
  public readonly id: string
  public readonly name?: string

  constructor(props: CommandProps<IUpdateBaseCommandInput>) {
    super(props)
    this.id = props.id
    this.name = props.name
  }
}
