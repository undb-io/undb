import { Command, CommandProps } from '@egodb/domain'
import { ICreateTableInput } from './create-table.command.interface'

export class CreateTableCommand extends Command implements ICreateTableInput {
  readonly name: string

  constructor(props: CommandProps<ICreateTableInput>) {
    super(props)
    this.name = props.name
  }
}
