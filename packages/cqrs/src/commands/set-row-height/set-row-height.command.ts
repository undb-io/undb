import { type IViewRowHeight } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ISetRowHeightCommandInput } from './set-row-height.command.interface.js'

export class SetRowHeightCommand extends Command implements ISetRowHeightCommandInput {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly rowHeight: IViewRowHeight

  constructor(props: CommandProps<ISetRowHeightCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.rowHeight = props.rowHeight
  }
}
