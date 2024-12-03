import { SubmitFormCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectSpaceService, type ISpaceService } from "@undb/space"
import { injectRecordsService, type IRecordsService } from "@undb/table"

@commandHandler(SubmitFormCommand)
@singleton()
export class SubmitFormCommandHandler implements ICommandHandler<SubmitFormCommand, any> {
  logger = createLogger(SubmitFormCommandHandler.name)
  constructor(
    @injectRecordsService()
    private readonly service: IRecordsService,
    @injectSpaceService()
    private readonly spaceService: ISpaceService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: SubmitFormCommand): Promise<any> {
    this.logger.debug(command, "executing submit form command")

    await this.spaceService.setSpaceContext(this.context, { tableId: command.tableId })

    const record = await this.service.submitForm(command, { form: command.form, values: command.values })

    return record.id.value
  }
}
