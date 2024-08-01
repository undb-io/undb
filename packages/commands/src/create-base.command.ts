import { createBaseDTO } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const createBaseCommand = createBaseDTO.omit({ id: true })

export type ICreateBaseCommand = z.infer<typeof createBaseCommand>

export class CreateBaseCommand extends Command implements ICreateBaseCommand {
  public readonly name: string

  constructor(props: CommandProps<ICreateBaseCommand>) {
    super(props)
    this.name = props.name
  }
}
