import { Command, type CommandProps } from "@undb/domain"
import { createViewWidgetDTO, tableId, type IWidgetDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createViewWidgetCommand = createViewWidgetDTO.extend({
  tableId: tableId,
})

export type ICreateViewWidgetCommand = z.infer<typeof createViewWidgetCommand>

export class CreateViewWidgetCommand extends Command implements ICreateViewWidgetCommand {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widget: IWidgetDTO

  constructor(props: CommandProps<ICreateViewWidgetCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widget = props.widget
  }
}
