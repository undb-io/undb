import { BulkUpdateRecordsCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(BulkUpdateRecordsCommand)
@singleton()
export class BulkUpdateRecordsCommandHandler implements ICommandHandler<BulkUpdateRecordsCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: BulkUpdateRecordsCommand): Promise<any> {
    await this.service.bulkUpdateRecords(command.tableId, { filter: command.filter, values: command.values })
  }
}
