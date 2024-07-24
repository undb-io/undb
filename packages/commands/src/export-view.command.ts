import { Command, type CommandProps } from "@undb/domain"
import { exportViewDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const exportViewCommand = exportViewDTO.extend({
  tableId,
})

export type IExportViewCommand = z.infer<typeof exportViewCommand>

export class ExportViewCommand extends Command implements IExportViewCommand {
  public readonly tableId: string
  public readonly viewId: string

  constructor(props: CommandProps<IExportViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
