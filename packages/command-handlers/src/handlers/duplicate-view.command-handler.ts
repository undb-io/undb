import { DuplicateViewCommand, type IDuplicateViewCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(DuplicateViewCommand)
@singleton()
export class DuplicateViewCommandHandler implements ICommandHandler<DuplicateViewCommand, IDuplicateViewCommandOutput> {
  public readonly logger = createLogger(DuplicateViewCommandHandler.name)
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: DuplicateViewCommand): Promise<IDuplicateViewCommandOutput> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const { spec, view } = table.$duplicateView(command)

    await this.repo.updateOneById(table, spec)

    return {
      tableId: table.id.value,
      viewId: view.id.value,
    }
  }
}
