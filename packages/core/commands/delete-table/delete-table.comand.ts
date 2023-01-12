import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IDeleteTableInput } from './delete-table.command.input'

export class DeleteTableCommand extends Command {
  readonly id: string

  constructor(props: CommandProps<IDeleteTableInput>) {
    super(props)
    this.id = props.id
  }
}
