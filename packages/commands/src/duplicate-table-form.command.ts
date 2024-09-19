import { Command, type CommandProps } from "@undb/domain"
import { duplicateTableFormDTO, formId, tableId, type IDuplicateTableFormDTO } from "@undb/table"
import { z } from "@undb/zod"

export const duplicateTableFormCommand = duplicateTableFormDTO

export type IDuplicateTableFormCommand = z.infer<typeof duplicateTableFormCommand>

export const duplicateTableFormCommandOutput = z.object({
  tableId,
  formId,
})

export type IDuplicateTableFormCommandOutput = z.infer<typeof duplicateTableFormCommandOutput>

export class DuplicateTableFormCommand extends Command {
  public readonly input: IDuplicateTableFormDTO

  constructor(props: CommandProps<IDuplicateTableFormDTO>) {
    super(props)
    this.input = props
  }
}
