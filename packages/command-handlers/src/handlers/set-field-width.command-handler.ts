import { SetFieldWidthCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetFieldWidthCommand)
@singleton()
export class SetFieldWidthCommandHandler implements ICommandHandler<SetFieldWidthCommand, any> {
  public readonly logger = createLogger(SetFieldWidthCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetFieldWidthCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setFieldWidth(command)

    await this.repo.updateOneById(table, spec)
  }
}
