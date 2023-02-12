import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IEditTableCommandInput } from './edit-table.command.interface.js'

export class EditTableCommand extends Command implements IEditTableCommandInput {
  public readonly id: string
  public readonly name?: string

  constructor(props: CommandProps<IEditTableCommandInput>) {
    super(props)
    this.id = props.id
    this.name = props.name
  }
}
