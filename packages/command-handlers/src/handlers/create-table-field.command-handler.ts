import { CreateTableFieldCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableFieldCommand)
@singleton()
export class CreateTableFieldCommandHandler implements ICommandHandler<CreateTableFieldCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableFieldCommand): Promise<any> {
    const table = await this.service.createTableField(command.input)

    return table.id.value
  }
}
