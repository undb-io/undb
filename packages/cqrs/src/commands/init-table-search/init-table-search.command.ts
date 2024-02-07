import { Command, CommandProps } from '@undb/domain'
import { IInitTableSearchCommandInput } from './init-table-search.command.input'

export class InitTableSearchCommand extends Command implements IInitTableSearchCommandInput {
  public readonly tableId: string
  constructor(props: CommandProps<IInitTableSearchCommandInput>) {
    super(props)
    this.tableId = props.tableId
  }
}
