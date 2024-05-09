import { CreateTableCommand } from '@undb/commands'
import { commandHandler } from '@undb/cqrs'
import { singleton } from '@undb/di'
import type { ICommandHandler } from '@undb/domain'
import { createLogger } from '@undb/logger'
import { injectTableService, type ITableService } from '@undb/table'

@commandHandler(CreateTableCommand)
@singleton()
export class CreateTableCommandHandler implements ICommandHandler<CreateTableCommand, any> {
  private readonly logger = createLogger(CreateTableCommandHandler.name)

  constructor(
    @injectTableService()
    private readonly service: ITableService
  ) {}

  async execute(command: CreateTableCommand): Promise<any> {
    this.logger.debug(command)

    const table = await this.service.createTable(command)

    return table.id.value
  }
}
