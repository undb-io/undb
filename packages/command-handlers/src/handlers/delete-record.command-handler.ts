import { DeleteRecordCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(DeleteRecordCommand)
@singleton()
export class DeleteRecordCommandHandler implements ICommandHandler<DeleteRecordCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: DeleteRecordCommand): Promise<any> {
    await this.service.deleteRecord(command, { id: command.id })
  }
}
