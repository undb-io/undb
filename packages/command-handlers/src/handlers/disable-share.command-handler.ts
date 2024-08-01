import { DisableShareCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectShareService, type IShareService } from "@undb/share"

@commandHandler(DisableShareCommand)
@singleton()
export class DisableShareCommandHandler implements ICommandHandler<DisableShareCommand, any> {
  private readonly logger = createLogger(DisableShareCommandHandler.name)

  constructor(
    @injectShareService()
    private readonly service: IShareService,
  ) {}

  async execute(command: DisableShareCommand): Promise<any> {
    this.logger.debug(command)

    await this.service.disableShare(command)
  }
}
