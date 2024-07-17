import { Command, type CommandProps } from "@undb/domain"
import { updateTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const updateTableCommand = updateTableDTO

export type IUpdateTableCommand = z.infer<typeof updateTableCommand>

export class UpdateTableCommand extends Command implements IUpdateTableCommand {
  public readonly id: string
  public readonly name: string

  constructor(props: CommandProps<IUpdateTableCommand>) {
    super(props)
    this.id = props.id
    this.name = props.name
  }
}
