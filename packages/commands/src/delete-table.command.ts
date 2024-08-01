import { Command, type CommandProps } from "@undb/domain"
import { deleteTableDTO, type IDeleteTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const deleteTableCommand = deleteTableDTO

export type IDeleteTableCommand = z.infer<typeof deleteTableCommand>

export class DeleteTableCommand extends Command {
  public readonly input: IDeleteTableDTO

  constructor(props: CommandProps<IDeleteTableDTO>) {
    super(props)
    this.input = props
  }
}
