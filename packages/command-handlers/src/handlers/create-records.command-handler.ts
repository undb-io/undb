import { CreateRecordsCommand, type ICreateRecordsCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(CreateRecordsCommand)
@singleton()
export class CreateRecordsCommandHandler implements ICommandHandler<CreateRecordsCommand, ICreateRecordsCommandOutput> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: CreateRecordsCommand): Promise<ICreateRecordsCommandOutput> {
    await this.service.createRecords(command, command.records)
  }
}
