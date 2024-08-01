import { BulkUpdateRecordsCommand, type IBulkUpdateRecordsCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(BulkUpdateRecordsCommand)
@singleton()
export class BulkUpdateRecordsCommandHandler
  implements ICommandHandler<BulkUpdateRecordsCommand, IBulkUpdateRecordsCommandOutput>
{
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: BulkUpdateRecordsCommand): Promise<IBulkUpdateRecordsCommandOutput> {
    const records = await this.service.bulkUpdateRecords(command, {
      filter: command.filter,
      values: command.values,
      isOpenapi: command.isOpenapi,
    })

    return { modifiedCount: records.length }
  }
}
