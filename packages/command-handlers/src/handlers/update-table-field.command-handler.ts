import { UpdateTableFieldCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(UpdateTableFieldCommand)
@singleton()
export class UpdateTableFieldCommandHandler implements ICommandHandler<UpdateTableFieldCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: UpdateTableFieldCommand): Promise<any> {
    const table = await this.service.updateTableField(command.input)

    return table.id.value
  }
}
