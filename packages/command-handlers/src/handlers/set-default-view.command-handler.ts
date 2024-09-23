import { SetDefaultViewCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetDefaultViewCommand)
@singleton()
export class SetDefaultViewCommandHandler implements ICommandHandler<SetDefaultViewCommand, any> {
  public readonly logger = createLogger(SetDefaultViewCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetDefaultViewCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setDefaultView(command)

    if (spec.isSome()) {
      await this.repo.updateOneById(table, spec)
    }
  }
}
