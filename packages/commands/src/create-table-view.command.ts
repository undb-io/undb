import { baseIdSchema } from "@undb/base"
import { Command, type CommandProps } from "@undb/domain"
import { createTableViewDTO, tableId, viewId, type ICreateTableViewDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createTableViewCommand = createTableViewDTO

export type ICreateViewCommand = z.infer<typeof createTableViewCommand>

export const createTableViewCommandOutput = z.object({
  baseId: baseIdSchema,
  tableId: tableId,
  viewId: viewId,
})

export type ICreateTableViewCommandOutput = z.infer<typeof createTableViewCommandOutput>

export class CreateTableViewCommand extends Command {
  public readonly input: ICreateTableViewDTO

  constructor(props: CommandProps<ICreateTableViewDTO>) {
    super(props)
    this.input = props
  }
}
