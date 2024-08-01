import { SetViewAggregateCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewAggregateCommand)
@singleton()
export class SetViewAggregateCommandHandler implements ICommandHandler<SetViewAggregateCommand, any> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetViewAggregateCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewAggregate(command)

    await this.repo.updateOneById(table, spec)
  }
}
