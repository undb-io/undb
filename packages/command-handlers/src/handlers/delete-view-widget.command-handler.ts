import { DeleteViewWidgetCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableRepository, TableIdVo, type ITableRepository } from "@undb/table"

@commandHandler(DeleteViewWidgetCommand)
@singleton()
export class DeleteViewWidgetCommandHandler implements ICommandHandler<DeleteViewWidgetCommand, void> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: DeleteViewWidgetCommand): Promise<void> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).expect("table not found")

    const spec = table.views.$deleteWidget(table, command)

    await this.repo.updateOneById(table, spec)
  }
}
