import { Command, type CommandProps } from "@undb/domain"
import { createTableViewDTO, type ICreateTableViewDTO } from "@undb/table"
import { z } from "@undb/zod"

export const createTableViewCommand = createTableViewDTO

export type ICreateViewCommand = z.infer<typeof createTableViewCommand>

export class CreateTableViewCommand extends Command {
  public readonly input: ICreateTableViewDTO

  constructor(props: CommandProps<ICreateTableViewDTO>) {
    super(props)
    this.input = props
  }
}
