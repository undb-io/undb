import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetGanttFieldCommandInput } from './set-gantt-field.command.interface.js'

export class SetGanttFieldCommand extends Command implements ISetGanttFieldCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly field: string

  constructor(props: CommandProps<ISetGanttFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.field = props.field
  }
}
