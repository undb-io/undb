import { DeleteTableFieldCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DeleteTableFieldCommand)
@singleton()
export class DeleteTableFieldCommandHandler implements ICommandHandler<DeleteTableFieldCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DeleteTableFieldCommand): Promise<any> {
    const table = await this.service.deleteTableField(command.input)

    return table.id.value
  }
}
