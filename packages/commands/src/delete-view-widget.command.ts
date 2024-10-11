import { Command, type CommandProps } from "@undb/domain"
import { deleteViewWidgetDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const deleteViewWidgetCommand = deleteViewWidgetDTO.extend({
  tableId: tableId,
})

export type IDeleteViewWidgetCommand = z.infer<typeof deleteViewWidgetCommand>

export class DeleteViewWidgetCommand extends Command implements IDeleteViewWidgetCommand {
  public readonly id: string
  public readonly viewId: string
  public readonly tableId: string

  constructor(props: CommandProps<IDeleteViewWidgetCommand>) {
    super(props)
    this.id = props.id
    this.viewId = props.viewId
    this.tableId = props.tableId
  }
}
