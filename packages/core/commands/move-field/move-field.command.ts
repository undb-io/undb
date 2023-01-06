import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IMoveFieldCommandInput } from './move-field.command.interface'

export class MoveFieldCommand extends Command implements IMoveFieldCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly from: string
  readonly to: string

  constructor(props: CommandProps<IMoveFieldCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.from = props.from
    this.to = props.to
  }
}
