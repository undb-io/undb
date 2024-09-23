import { Command, type CommandProps } from "@undb/domain"
import { setDefaultViewDTO, tableId } from "@undb/table"
import { z } from "@undb/zod"

export const setDefaultViewCommand = setDefaultViewDTO.merge(z.object({ tableId: tableId }))

export type ISetDefaultViewCommand = z.infer<typeof setDefaultViewCommand>

export class SetDefaultViewCommand extends Command {
  public readonly tableId: string
  public readonly viewId: string

  constructor(props: CommandProps<ISetDefaultViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
