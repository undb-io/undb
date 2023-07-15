import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteTableInput } from './delete-table.command.input.js'

export class DeleteTableCommand extends Command {
  readonly id: string

  constructor(props: CommandProps<IDeleteTableInput>) {
    super(props)
    this.id = props.id
  }
}
