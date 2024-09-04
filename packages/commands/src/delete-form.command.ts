import { Command, type CommandProps } from "@undb/domain"
import { deleteTableFormDTO, type IDeleteTableFormDTO } from "@undb/table"
import { z } from "@undb/zod"

export const deleteFormCommand = deleteTableFormDTO

export type IDeleteFormCommand = z.infer<typeof deleteFormCommand>

export class DeleteFormCommand extends Command {
  public readonly input: IDeleteTableFormDTO

  constructor(props: CommandProps<IDeleteTableFormDTO>) {
    super(props)
    this.input = props
  }
}
