import { Command, type CommandProps } from "@undb/domain"
import { setFieldWidthDTO } from "@undb/table"
import { z } from "@undb/zod"

export const setFieldWidthCommand = setFieldWidthDTO

export type ISetFieldWidthCommand = z.infer<typeof setFieldWidthCommand>

export class SetFieldWidthCommand extends Command {
  public readonly tableId: string
  public readonly viewId?: string
  public readonly field: string
  public readonly width: number

  constructor(props: CommandProps<ISetFieldWidthCommand>) {
    super(props)
    this.tableId = props.tableId
    this.viewId = props.viewId
    this.field = props.field
    this.width = props.width
  }
}
