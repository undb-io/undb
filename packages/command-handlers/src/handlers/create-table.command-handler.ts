import { CreateTableCommand } from "@undb/commands"
import { mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableCommand)
@singleton()
export class CreateTableCommandHandler implements ICommandHandler<CreateTableCommand, any> {
  private readonly logger = createLogger(CreateTableCommandHandler.name)

  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableCommand): Promise<any> {
    this.logger.debug(command)

    const spaceId = mustGetCurrentSpaceId()
    const table = await this.service.createTable({ ...command, spaceId })

    return table.id.value
  }
}
