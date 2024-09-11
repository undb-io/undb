import { SubmitFormCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(SubmitFormCommand)
@singleton()
export class SubmitFormCommandHandler implements ICommandHandler<SubmitFormCommand, any> {
  logger = createLogger(SubmitFormCommandHandler.name)
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
  ) {}

  async execute(command: SubmitFormCommand): Promise<any> {
    this.logger.debug(command, "executing submit form command")
    const record = await this.service.submitForm(command, { formId: command.formId, values: command.values })

    return record.id.value
  }
}
