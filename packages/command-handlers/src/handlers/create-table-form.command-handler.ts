import { CreateTableFormCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableFormCommand)
@singleton()
export class CreateTableFormCommandHandler implements ICommandHandler<CreateTableFormCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableFormCommand): Promise<any> {
    const table = await this.service.createTableForm(command.input)

    return table.id.value
  }
}
