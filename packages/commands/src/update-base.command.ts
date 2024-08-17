import { updateBaseDTO } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const updateBaseCommand = updateBaseDTO

export type IUpdateBaseCommand = z.infer<typeof updateBaseCommand>

export class UpdateBaseCommand extends Command implements IUpdateBaseCommand {
  public readonly id: string
  public readonly name?: string
  public readonly allowTemplate?: boolean

  constructor(props: CommandProps<IUpdateBaseCommand>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.allowTemplate = props.allowTemplate
  }
}
