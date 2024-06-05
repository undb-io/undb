import { SetViewFieldsCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { TableIdVo, injectTableRepository, type ITableRepository } from "@undb/table"

@commandHandler(SetViewFieldsCommand)
@singleton()
export class SetViewFieldsCommandHandler implements ICommandHandler<SetViewFieldsCommand, any> {
  constructor(
    @injectTableRepository()
    private readonly repo: ITableRepository,
  ) {}

  async execute(command: SetViewFieldsCommand): Promise<any> {
    const table = (await this.repo.findOneById(new TableIdVo(command.tableId))).unwrap()

    const spec = table.$setViewFields(command)

    await this.repo.updateOneById(table, spec)
  }
}
