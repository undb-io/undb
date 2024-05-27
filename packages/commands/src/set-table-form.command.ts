import { Command, type CommandProps } from "@undb/domain"
import { setTableFormDTO, type IFormDTO } from "@undb/table"
import { z } from "@undb/zod"

export const setTableFormCommand = setTableFormDTO

export type ISetTableFormCommand = z.infer<typeof setTableFormCommand>

export class SetTableFormCommand extends Command implements ISetTableFormCommand {
  public readonly tableId: string
  public readonly form: IFormDTO

  constructor(props: CommandProps<ISetTableFormCommand>) {
    super(props)
    this.tableId = props.tableId
    this.form = props.form
  }
}
