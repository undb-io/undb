import { Command, type CommandProps } from "@undb/domain"
import { duplicateTableDTO, type IDuplicateTableDTO } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateTableCommand = duplicateTableDTO

export type IDuplicateTableCommand = z.infer<typeof duplicateTableCommand>

export class DuplicateTableCommand extends Command {
  public readonly input: IDuplicateTableDTO

  constructor(props: CommandProps<IDuplicateTableDTO>) {
    super(props)
    this.input = props
  }
}
