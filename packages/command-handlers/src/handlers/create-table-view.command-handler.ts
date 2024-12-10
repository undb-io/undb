import { CreateTableViewCommand, type ICreateTableViewCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableViewCommand)
@singleton()
export class CreateTableViewCommandHandler
  implements ICommandHandler<CreateTableViewCommand, ICreateTableViewCommandOutput>
{
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableViewCommand): Promise<ICreateTableViewCommandOutput> {
    const { table, view } = await this.service.createTableView(command.input)

    return {
      baseId: table.baseId,
      tableId: table.id.value,
      viewId: view.id.value,
    }
  }
}
