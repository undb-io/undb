import { CreateTableViewCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableViewCommand)
@singleton()
export class CreateTableViewCommandHandler implements ICommandHandler<CreateTableViewCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableViewCommand): Promise<any> {
    const table = await this.service.createTableView(command.input)

    return table.id.value
  }
}
