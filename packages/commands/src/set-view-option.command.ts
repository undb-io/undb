import { Command, type CommandProps } from "@undb/domain"
import { setViewOptionDTO, type IViewOption } from "@undb/table"
import { z } from "@undb/zod"

export const setViewOptionCommand = setViewOptionDTO

export type ISetViewOptionCommand = z.infer<typeof setViewOptionCommand>

export class SetViewOptionCommand extends Command implements ISetViewOptionCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly option: IViewOption

  constructor(props: CommandProps<ISetViewOptionCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.option = props.option
  }
}
