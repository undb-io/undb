import { Command, type CommandProps } from "@undb/domain"
import { setViewSortDTO, type IViewSort } from "@undb/table"
import { z } from "@undb/zod"

export const setViewSortCommand = setViewSortDTO

export type ISetViewSortCommand = z.infer<typeof setViewSortCommand>

export class SetViewSortCommand extends Command implements ISetViewSortCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly sort: IViewSort

  constructor(props: CommandProps<ISetViewSortCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.sort = props.sort
  }
}
