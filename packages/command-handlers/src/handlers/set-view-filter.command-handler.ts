import { fieldFilter } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(fieldFilter)
@singleton()
export class SetViewFilterCommandHandler implements ICommandHandler<fieldFilter, any> {
  public readonly logger = createLogger(SetViewFilterCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: fieldFilter): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewFilter(command)

    await this.repo.updateOneById(table, spec)
  }
}
