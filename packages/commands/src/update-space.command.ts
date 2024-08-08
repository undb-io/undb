import { Command, type CommandProps } from "@undb/domain"
import { updateSpaceDTO } from "@undb/space"
import { z } from "@undb/zod"

export const updateSpaceCommand = updateSpaceDTO

export type IUpdateSpaceCommand = z.infer<typeof updateSpaceCommand>

export class UpdateSpaceCommand extends Command implements IUpdateSpaceCommand {
  public readonly name: string

  constructor(props: CommandProps<IUpdateSpaceCommand>) {
    super(props)
    this.name = props.name
  }
}
