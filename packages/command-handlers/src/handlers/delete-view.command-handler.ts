import { DeleteViewCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(DeleteViewCommand)
@singleton()
export class DeleteViewCommandHandler implements ICommandHandler<DeleteViewCommand, any> {
  public readonly logger = createLogger(DeleteViewCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: DeleteViewCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$deleteView(command)

    await this.repo.updateOneById(table, spec)
  }
}
