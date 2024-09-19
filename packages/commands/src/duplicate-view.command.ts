import { Command, type CommandProps } from "@undb/domain"
import { duplicateViewDTO, tableId, viewId } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateViewCommand = duplicateViewDTO

export type IDuplicateViewCommand = z.infer<typeof duplicateViewCommand>

export const duplicateViewCommandOutput = z.object({
  tableId: tableId,
  viewId: viewId,
})

export type IDuplicateViewCommandOutput = z.infer<typeof duplicateViewCommandOutput>

export class DuplicateViewCommand extends Command implements IDuplicateViewCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly name: string

  constructor(props: CommandProps<IDuplicateViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.name = props.name
  }
}
