import { Command, type CommandProps } from "@undb/domain"
import { duplicateTableFieldDTO, type IDuplicateTableFieldDTO } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateTableFieldCommand = duplicateTableFieldDTO

export type IDuplicateFieldCommand = z.infer<typeof duplicateTableFieldCommand>

export class DuplicateTableFieldCommand extends Command {
  public readonly input: IDuplicateTableFieldDTO

  constructor(props: CommandProps<IDuplicateTableFieldDTO>) {
    super(props)
    this.input = props
  }
}
