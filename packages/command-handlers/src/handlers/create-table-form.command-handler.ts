import { CreateTableFormCommand, type ICreateTableFormCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateTableFormCommand)
@singleton()
export class CreateTableFormCommandHandler
  implements ICommandHandler<CreateTableFormCommand, ICreateTableFormCommandOutput>
{
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: CreateTableFormCommand): Promise<ICreateTableFormCommandOutput> {
    const { table, form } = await this.service.createTableForm(command.input)

    return {
      tableId: table.id.value,
      formId: form.id,
    }
  }
}
