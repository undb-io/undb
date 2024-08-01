import { UpdateViewCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(UpdateViewCommand)
@singleton()
export class UpdateViewCommandHandler implements ICommandHandler<UpdateViewCommand, any> {
  public readonly logger = createLogger(UpdateViewCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: UpdateViewCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$updateView(command)

    await this.repo.updateOneById(table, spec)
  }
}
