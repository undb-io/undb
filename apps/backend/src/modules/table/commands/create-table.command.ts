import { Command, CommandProps } from '@egodb/domain'
export class CreateTableCommand extends Command {
  readonly name: string

  constructor(props: CommandProps<CreateTableCommand>) {
    super(props)
    this.name = props.name
  }
}
