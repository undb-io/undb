import { SetTableRLSCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetTableRLSCommand)
@singleton()
export class SetTableRLSCommandHandler implements ICommandHandler<SetTableRLSCommand, any> {
  public readonly logger = createLogger(SetTableRLSCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetTableRLSCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setTableRLS(command)

    await this.repo.updateOneById(table, spec)
  }
}
