import { SetViewSortCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewSortCommand)
@singleton()
export class SetViewSortCommandHandler implements ICommandHandler<SetViewSortCommand, any> {
  public readonly logger = createLogger(SetViewSortCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetViewSortCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewSort(command)

    await this.repo.updateOneById(table, spec)
  }
}
