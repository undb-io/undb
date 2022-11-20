import { Command, CommandProps } from '@egodb/domain'

export interface ICreateTableCommand {
  readonly name: string
}

export class CreateTableCommand extends Command implements ICreateTableCommand {
  readonly name: string

  constructor(props: CommandProps<CreateTableCommand>) {
    super(props)
    this.name = props.name
  }
}
