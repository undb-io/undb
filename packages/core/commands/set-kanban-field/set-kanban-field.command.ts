import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetKanbanFieldCommandInput } from './set-kanban-field.command.interface'

export class SetKanbanFieldCommand extends Command implements ISetKanbanFieldCommandInput {
  readonly tableId: string
  readonly viewName?: string
  readonly field: string

  constructor(props: CommandProps<ISetKanbanFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewName = props.viewName
    this.field = props.field
  }
}
