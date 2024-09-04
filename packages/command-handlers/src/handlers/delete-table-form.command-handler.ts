import { DeleteFormCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DeleteFormCommand)
@singleton()
export class DeleteFormCommandHandler implements ICommandHandler<DeleteFormCommand, any> {
  constructor(
    @injectTableService()
    private readonly service: ITableService,
  ) {}

  async execute(command: DeleteFormCommand): Promise<any> {
    await this.service.deleteTableForm(command.input)

    return { success: true }
  }
}
