import { CreateRecordCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(CreateRecordCommand)
@singleton()
export class CreateRecordCommandHandler implements ICommandHandler<CreateRecordCommand, any> {
  logger = createLogger(CreateRecordCommandHandler.name)
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: CreateRecordCommand): Promise<any> {
    this.logger.debug(command, "executing create record command")
    const record = await this.service.createRecord(command, { id: command.id, values: command.values })

    return record.id.value
  }
}
