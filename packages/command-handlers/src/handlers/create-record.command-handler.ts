import { CreateRecordCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(CreateRecordCommand)
@singleton()
export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: CreateRecordCommand): Promise<any> {
    const record = await this.service.createRecord(command.tableId, { values: command.values })

    return record.id.value
  }
}
