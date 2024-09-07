import { Command, type CommandProps } from "@undb/domain"
import { updateViewDTO, type IKanbanOption, type ViewType } from "@undb/table"
import { z } from "@undb/zod"

export const updateViewCommand = updateViewDTO

export type IUpdateViewCommand = z.infer<typeof updateViewCommand>

export class UpdateViewCommand extends Command {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly name: string
  public readonly type: ViewType
  public readonly kanban?: IKanbanOption

  constructor(props: CommandProps<IUpdateViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.name = props.name
    this.type = props.type
    if (props.type === "kanban") {
      this.kanban = props.kanban
    }
  }
}
