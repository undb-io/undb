import { DuplicateTableCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DuplicateTableCommand)
@singleton()
export class DuplicateTableCommandHandler implements ICommandHandler<DuplicateTableCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DuplicateTableCommand): Promise<any> {
    const table = await this.service.duplicateTable(command.input)

    return table.id.value
  }
}
