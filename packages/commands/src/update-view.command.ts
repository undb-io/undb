import { Command,type CommandProps } from "@undb/domain"
import {
  updateViewDTO,
  type ICalendarOption,
  type IGalleryOption,
  type IKanbanOption,
  type IPivotOption,
  type ViewType,
} from "@undb/table"
import { z } from "@undb/zod"

export const updateViewCommand = updateViewDTO

export type IUpdateViewCommand = z.infer<typeof updateViewCommand>

export class UpdateViewCommand extends Command {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly name: string
  public readonly type: ViewType
  public readonly kanban?: IKanbanOption
  public readonly gallery?: IGalleryOption
  public readonly calendar?: ICalendarOption
  public readonly pivot?: IPivotOption

  constructor(props: CommandProps<IUpdateViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.name = props.name
    this.type = props.type
    if (props.type === "kanban") {
      // @ts-ignore
      this.kanban = props.kanban
    }
    if (props.type === "gallery") {
      // @ts-ignore
      this.gallery = props.gallery
    }
    if (props.type === "calendar") {
      // @ts-ignore
      this.calendar = props.calendar
    }
    if (props.type === "pivot") {
      // @ts-ignore
      this.pivot = props.pivot
    }
  }
}
