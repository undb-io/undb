import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDuplicateViewInput } from './duplicate-view.command.input.js'

export class DuplicateViewCommand extends Command {
  readonly id: string
  readonly tableId: string

  constructor(props: CommandProps<IDuplicateViewInput>) {
    super(props)
    this.tableId = props.tableId
    this.id = props.id
  }
}
