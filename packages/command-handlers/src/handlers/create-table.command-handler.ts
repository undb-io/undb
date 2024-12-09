import { CreateTableCommand, type ICreateTableCommandOutput } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableCommand)
@singleton()
export class CreateTableCommandHandler implements ICommandHandler<CreateTableCommand, ICreateTableCommandOutput> {
  private readonly logger = createLogger(CreateTableCommandHandler.name)

  constructor(
    @injectTableService()
    private readonly service: ITableService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: CreateTableCommand): Promise<ICreateTableCommandOutput> {
    this.logger.debug(command)

    const spaceId = this.context.mustGetCurrentSpaceId()
    const table = await this.service.createTable({ ...command, spaceId })

    return table.id.value
  }
}
