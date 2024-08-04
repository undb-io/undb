import { Command, type CommandProps } from "@undb/domain"
import { createSpaceDTO } from "@undb/space"
import { z } from "@undb/zod"

export const createSpaceCommand = createSpaceDTO.omit({ id: true, isPersonal: true })

export type ICreateSpaceCommand = z.infer<typeof createSpaceCommand>

export class CreateSpaceCommand extends Command implements ICreateSpaceCommand {
  public readonly name: string

  constructor(props: CommandProps<ICreateSpaceCommand>) {
    super(props)
    this.name = props.name
  }
}
