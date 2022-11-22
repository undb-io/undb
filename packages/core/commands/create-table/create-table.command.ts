import { Command, CommandProps } from '@egodb/domain'
import { ICreateTableCommand } from './create-table.command.interface'

export class CreateTableCommand extends Command implements ICreateTableCommand {
  readonly name: string

  constructor(props: CommandProps<ICreateTableCommand>) {
    super(props)
    this.name = props.name
  }
}
