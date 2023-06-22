import { ICreateWidgetSchema } from '@undb/core'
import type { CommandProps } from '@undb/domain'
import { Command } from '@undb/domain'
import type { ICreateWidgetCommandInput } from './create-widget.command.interface.js'

export class CreateWidgetCommand extends Command implements ICreateWidgetCommandInput {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widget: ICreateWidgetSchema

  constructor(props: CommandProps<ICreateWidgetCommandInput>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widget = props.widget
  }
}
