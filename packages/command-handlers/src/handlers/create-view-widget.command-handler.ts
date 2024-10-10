import { CreateViewWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableRepository, TableIdVo, type ITableRepository } from "@undb/table"

@commandHandler(CreateViewWidgetCommand)
@singleton()
export class CreateViewWidgetCommandHandler implements ICommandHandler<CreateViewWidgetCommand, void> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: CreateViewWidgetCommand): Promise<void> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).expect("table not found")

    const spec = table.views.$createWidget(table, command)

    await this.repo.updateOneById(table, spec)
  }
}
