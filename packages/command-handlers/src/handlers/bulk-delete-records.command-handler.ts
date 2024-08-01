import { BulkDeleteRecordsCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(BulkDeleteRecordsCommand)
@singleton()
export class BulkDeleteRecordsCommandHandler implements ICommandHandler<BulkDeleteRecordsCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: BulkDeleteRecordsCommand): Promise<any> {
    const records = await this.service.bulkDeleteRecords(command, {
      filter: command.filter,
      isOpenapi: command.isOpenapi,
    })
    return { deletedCount: records.length }
  }
}
