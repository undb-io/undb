import { SetViewOptionCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewOptionCommand)
@singleton()
export class SetViewOptionCommandHandler implements ICommandHandler<SetViewOptionCommand, any> {
  public readonly logger = createLogger(SetViewOptionCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetViewOptionCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewOption(command)

    await this.repo.updateOneById(table, spec)
  }
}
