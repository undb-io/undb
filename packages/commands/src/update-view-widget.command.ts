import { Command, type CommandProps } from "@undb/domain"
import { tableId, updateViewWidgetDTO, type IWidgetDTO } from "@undb/table"
import { z } from "@undb/zod"

export const updateViewWidgetCommand = updateViewWidgetDTO.extend({
  tableId: tableId,
})

export type IUpdateViewWidgetCommand = z.infer<typeof updateViewWidgetCommand>

export class UpdateViewWidgetCommand extends Command implements IUpdateViewWidgetCommand {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widget: IWidgetDTO

  constructor(props: CommandProps<IUpdateViewWidgetCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widget = props.widget
  }
}
