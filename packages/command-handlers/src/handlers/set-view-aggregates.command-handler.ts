import { SetViewAggregatesCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewAggregatesCommand)
@singleton()
export class SetViewAggregatesCommandHandler implements ICommandHandler<SetViewAggregatesCommand, any> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetViewAggregatesCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewAggregates(command)

    await this.repo.updateOneById(table, spec)
  }
}
