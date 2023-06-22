import { IRelayoutWidgetSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IRelayoutWidgetsCommandInput } from './relayout-widgets.command.interface.js'

export class RelayoutWidgetsCommand extends Command implements IRelayoutWidgetsCommandInput {
  readonly tableId: string
  readonly viewId: string
  readonly widgets: IRelayoutWidgetSchema[]

  constructor(props: CommandProps<IRelayoutWidgetsCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widgets = props.widgets
  }
}
