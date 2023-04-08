import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteFieldInput } from './delete-field.command.input.js'

export class DeleteFieldCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteFieldInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
