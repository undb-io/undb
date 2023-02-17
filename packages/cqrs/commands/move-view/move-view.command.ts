import type { CommandProps } from '@egodb/domain'
import { Command } from '@egodb/domain'
import type { IMoveViewCommandInput } from './move-view.command.interface.js'

export class MoveViewCommand extends Command implements IMoveViewCommandInput {
  readonly tableId: string
  readonly viewId?: string
  readonly from: string
  readonly to: string

  constructor(props: CommandProps<IMoveViewCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.from = props.from
    this.to = props.to
  }
}
