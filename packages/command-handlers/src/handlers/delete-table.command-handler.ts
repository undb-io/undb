import { DeleteTableCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DeleteTableCommand)
@singleton()
export class DeleteTableCommandHandler implements ICommandHandler<DeleteTableCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DeleteTableCommand): Promise<any> {
    const table = await this.service.deleteTable(command.input)

    return table.id.value
  }
}
