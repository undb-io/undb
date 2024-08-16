import { duplicateBaseDTO } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { z } from "@undb/zod"

export const duplicateBaseCommand = duplicateBaseDTO

export type IDuplicateBaseCommand = z.infer<typeof duplicateBaseCommand>

export class DuplicateBaseCommand extends Command implements IDuplicateBaseCommand {
  public readonly id: string
  public readonly name?: string
  public readonly includeData?: boolean

  constructor(props: CommandProps<IDuplicateBaseCommand>) {
    super(props)
    this.id = props.id
    this.name = props.name
    this.includeData = props.includeData
  }
}
