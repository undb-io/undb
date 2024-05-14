import { SetViewFilterCommand } from "@undb/commands"
import { injectContext, type IExecutionContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewFilterCommand)
@singleton()
export class SetViewFilterCommandHandler implements ICommandHandler<SetViewFilterCommand, any> {
  private readonly logger = createLogger(SetViewFilterCommandHandler.name)

  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
    @injectContext()
    private readonly context: IExecutionContext,
  ) {}

  async execute(command: SetViewFilterCommand): Promise<any> {
    this.logger.debug(command)

    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewFilter(command)

    await this.repo.updateOneById(table, spec)
  }
}
