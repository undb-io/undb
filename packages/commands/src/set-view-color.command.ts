import { Command, type CommandProps } from "@undb/domain"
import { setViewColorDTO, type IFilterGroup } from "@undb/table"
import { z } from "zod"

export const setViewColorCommand = setViewColorDTO

export type ISetViewColorCommand = z.infer<typeof setViewColorCommand>

export class SetViewColorCommand extends Command implements ISetViewColorCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly color: IFilterGroup

  constructor(props: CommandProps<ISetViewColorCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.color = props.color
  }
}
