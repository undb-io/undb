import { DuplicateTableFormCommand, type IDuplicateTableFormCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DuplicateTableFormCommand)
@singleton()
export class DuplicateTableFormCommandHandler
  implements ICommandHandler<DuplicateTableFormCommand, IDuplicateTableFormCommandOutput>
{
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DuplicateTableFormCommand): Promise<IDuplicateTableFormCommandOutput> {
    const { table, form } = await this.service.duplicateTableForm(command.input)

    return {
      tableId: table.id.value,
      formId: form.id,
    }
  }
}
