import { Command, type CommandProps } from "@undb/domain"
import { updateViewDTO } from "@undb/table"
import { z } from "@undb/zod"

export const updateViewCommand = updateViewDTO

export type IUpdateViewCommand = z.infer<typeof updateViewCommand>

export class UpdateViewCommand extends Command implements IUpdateViewCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly name: string

  constructor(props: CommandProps<IUpdateViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.name = props.name
  }
}
