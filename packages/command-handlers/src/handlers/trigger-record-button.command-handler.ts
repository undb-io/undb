import { TriggerRecordButtonCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(TriggerRecordButtonCommand)
@singleton()
export class TriggerRecordButtonCommandHandler implements ICommandHandler<TriggerRecordButtonCommand, any> {
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: TriggerRecordButtonCommand): Promise<any> {
    return this.service.triggerRecordButton(command, { recordId: command.recordId, field: command.field })
  }
}
