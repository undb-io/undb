import { EnableShareCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectShareService, type IShareService } from "@undb/share"

@commandHandler(EnableShareCommand)
@singleton()
export class EnableShareCommandHandler implements ICommandHandler<EnableShareCommand, any> {
  private readonly logger = createLogger(EnableShareCommandHandler.name)

  constructor(
    @injectShareService()
    private readonly service: IShareService,
  ) {}

  async execute(command: EnableShareCommand): Promise<any> {
    this.logger.debug(command)

    await this.service.enableShare(command)
  }
}
