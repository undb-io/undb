import { DuplicateTableFieldCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DuplicateTableFieldCommand)
@singleton()
export class DuplicateTableFieldCommandHandler implements ICommandHandler<DuplicateTableFieldCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DuplicateTableFieldCommand): Promise<any> {
    const table = await this.service.duplicateTableField(command.input)

    return table.id.value
  }
}
