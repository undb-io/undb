import { Command, type CommandProps } from "@undb/domain"
import { deleteTableFieldDTO, type IDeleteTableFieldDTO } from "@undb/table"
import { z } from "@undb/zod"

export const deleteTableFieldCommand = deleteTableFieldDTO

export type IDeleteFieldCommand = z.infer<typeof deleteTableFieldCommand>

export class DeleteTableFieldCommand extends Command {
  public readonly input: IDeleteTableFieldDTO

  constructor(props: CommandProps<IDeleteTableFieldDTO>) {
    super(props)
    this.input = props
  }
}
