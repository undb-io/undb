import { UpdateViewWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableRepository, TableIdVo, type ITableRepository } from "@undb/table"

@commandHandler(UpdateViewWidgetCommand)
@singleton()
export class UpdateViewWidgetCommandHandler implements ICommandHandler<UpdateViewWidgetCommand, void> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: UpdateViewWidgetCommand): Promise<void> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).expect("table not found")

    const spec = table.views.$updateWidget(table, command)

    await this.repo.updateOneById(table, spec)
  }
}
