import { deleteBaseDTO } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const deleteBaseCommand = deleteBaseDTO

export type IDeleteBaseCommand = z.infer<typeof deleteBaseCommand>

export class DeleteBaseCommand extends Command implements IDeleteBaseCommand {
  public readonly id: string

  constructor(props: CommandProps<IDeleteBaseCommand>) {
    super(props)
    this.id = props.id
  }
}
