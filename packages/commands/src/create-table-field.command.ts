import { Command, type CommandProps } from "@undb/domain"
import { createTableFieldDTO, type ICreateTableFieldDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createTableFieldCommand = createTableFieldDTO

export type ICreateFieldCommand = z.infer<typeof createTableFieldCommand>

export class CreateTableFieldCommand extends Command {
  public readonly input: ICreateTableFieldDTO

  constructor(props: CommandProps<ICreateTableFieldDTO>) {
    super(props)
    this.input = props
  }
}
