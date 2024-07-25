import { BulkDuplicateRecordsCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(BulkDuplicateRecordsCommand)
@singleton()
export class BulkDuplicateRecordsCommandHandler implements ICommandHandler<BulkDuplicateRecordsCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: BulkDuplicateRecordsCommand): Promise<any> {
    const records = await this.service.bulkDuplicateRecords(command, {
      filter: command.filter,
      isOpenapi: command.isOpenapi,
    })

    return { count: records.length }
  }
}
