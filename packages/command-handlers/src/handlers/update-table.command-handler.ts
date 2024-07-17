import { UpdateTableCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(UpdateTableCommand)
@singleton()
export class UpdateTableCommandHandler implements ICommandHandler<UpdateTableCommand, any> {
  private readonly logger = createLogger(UpdateTableCommandHandler.name)

  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: UpdateTableCommand): Promise<any> {
    this.logger.debug(command)

    const table = await this.service.updateTable(command)

    return table.id.value
  }
}
