import { Command, type CommandProps } from "@undb/domain"
import { createTableFormDTO, formId, tableId, type ICreateTableFormDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createTableFormCommand = createTableFormDTO

export type ICreateFormCommand = z.infer<typeof createTableFormCommand>

export const createTableFormCommandOutput = z.object({
  tableId,
  formId,
})

export type ICreateTableFormCommandOutput = z.infer<typeof createTableFormCommandOutput>

export class CreateTableFormCommand extends Command {
  public readonly input: ICreateTableFormDTO

  constructor(props: CommandProps<ICreateTableFormDTO>) {
    super(props)
    this.input = props
  }
}
