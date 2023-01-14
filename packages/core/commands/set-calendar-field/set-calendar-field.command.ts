import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { ISetCalendarFieldCommandInput } from './set-calendar-field.command.interface'

export class SetCalendarFieldCommand extends Command implements ISetCalendarFieldCommandInput {
  readonly tableId: string
  readonly viewKey?: string
  readonly field: string

  constructor(props: CommandProps<ISetCalendarFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewKey = props.viewKey
    this.field = props.field
  }
}
