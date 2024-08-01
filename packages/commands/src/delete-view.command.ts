import { Command, type CommandProps } from "@undb/domain"
import { deleteViewDTO } from "@undb/table"
import { z } from "@undb/zod"

export const deleteViewCommand = deleteViewDTO

export type IDeleteViewCommand = z.infer<typeof deleteViewCommand>

export class DeleteViewCommand extends Command implements IDeleteViewCommand {
  public readonly tableId: string
  public readonly viewId?: string

  constructor(props: CommandProps<IDeleteViewCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
  }
}
