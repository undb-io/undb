import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { IDeleteWidgetCommandInput } from './delete-widget.command.interface.js'

export class DeleteWidgetCommand extends Command implements IDeleteWidgetCommandInput {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widgetId: string

  constructor(props: CommandProps<IDeleteWidgetCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widgetId = props.widgetId
  }
}
