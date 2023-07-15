import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteViewInput } from './delete-view.command.input.js'

export class DeleteViewCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDeleteViewInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
