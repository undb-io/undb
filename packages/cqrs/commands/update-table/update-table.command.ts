import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IUpdateTableCommandInput } from './update-table.command.interface.js'

export class UpdateTableCommand extends Command implements IUpdateTableCommandInput {
  public readonly id: string
  public readonly name?: string

  constructor(props: CommandProps<IUpdateTableCommandInput>) {
    super(props)
    this.id = props.id
    this.name = props.name
  }
}
