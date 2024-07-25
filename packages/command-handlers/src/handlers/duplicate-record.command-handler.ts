import { DuplicateRecordCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(DuplicateRecordCommand)
@singleton()
export class DuplicateRecordCommandHandler implements ICommandHandler<DuplicateRecordCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: DuplicateRecordCommand): Promise<any> {
    const record = await this.service.duplicateRecord(command, { id: command.id })
    return {
      recordId: record.id.value,
    }
  }
}
