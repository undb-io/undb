import { UpdateRecordCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(UpdateRecordCommand)
@singleton()
export class UpdateRecordCommandHandler implements ICommandHandler<UpdateRecordCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: UpdateRecordCommand): Promise<any> {
    await this.service.updateRecord(command, { id: command.id, values: command.values })
  }
}
