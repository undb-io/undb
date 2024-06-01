import { Command, type CommandProps } from "@undb/domain"
import { updateTableFieldDTO, type IUpdateTableFieldDTO } from "@undb/table"
import { z } from "@undb/zod"

export const updateTableFieldCommand = updateTableFieldDTO

export type IUpdateFieldCommand = z.infer<typeof updateTableFieldCommand>

export class UpdateTableFieldCommand extends Command {
  public readonly input: IUpdateTableFieldDTO

  constructor(props: CommandProps<IUpdateTableFieldDTO>) {
    super(props)
    this.input = props
  }
}
