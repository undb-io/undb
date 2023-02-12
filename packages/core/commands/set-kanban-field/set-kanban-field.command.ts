import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetKanbanFieldCommandInput } from './set-kanban-field.command.interface.js'

export class SetKanbanFieldCommand extends Command implements ISetKanbanFieldCommandInput {
  readonly tableId: string
  readonly viewKey?: string
  readonly field: string

  constructor(props: CommandProps<ISetKanbanFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewKey = props.viewKey
    this.field = props.field
  }
}
