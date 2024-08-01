import { Command, type CommandProps } from "@undb/domain"
import { setViewFilterDTO, type IViewFilterGroup } from "@undb/table"
import { z } from "@undb/zod"

export const setViewFilterCommand = setViewFilterDTO

export type ISetViewFilterCommand = z.infer<typeof setViewFilterCommand>

export class SetViewFilterCommand extends Command implements ISetViewFilterCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly filter: IViewFilterGroup

  constructor(props: CommandProps<ISetViewFilterCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.filter = props.filter
  }
}
