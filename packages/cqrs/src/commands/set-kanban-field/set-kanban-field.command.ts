import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetKanbanFieldCommandInput } from './set-kanban-field.command.interface.js'

export class SetKanbanFieldCommand extends Command implements ISetKanbanFieldCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly field: string

  constructor(props: CommandProps<ISetKanbanFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.field = props.field
  }
}
