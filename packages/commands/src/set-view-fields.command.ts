import { Command, type CommandProps } from "@undb/domain"
import { setViewFieldsDTO, type IViewFields } from "@undb/table"
import { z } from "@undb/zod"

export const setViewFieldsCommand = setViewFieldsDTO

export type ISetViewFieldsCommand = z.infer<typeof setViewFieldsCommand>

export class SetViewFieldsCommand extends Command implements ISetViewFieldsCommand {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly fields: IViewFields

  constructor(props: CommandProps<ISetViewFieldsCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.fields = props.fields
  }
}
