import { Command, type CommandProps } from "@undb/domain"
import { duplicateViewWidgetDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateViewWidgetCommand = duplicateViewWidgetDTO.extend({
  tableId,
})

export type IDuplicateViewWidgetCommand = z.infer<typeof duplicateViewWidgetCommand>

export class DuplicateViewWidgetCommand extends Command implements IDuplicateViewWidgetCommand {
  public readonly tableId: string
  public readonly viewId: string
  public readonly widgetId: string

  constructor(props: CommandProps<IDuplicateViewWidgetCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.widgetId = props.widgetId
  }
}
