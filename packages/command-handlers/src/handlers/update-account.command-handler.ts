import { UpdateAccountCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectUserService, type IUserService } from "@undb/user"

@commandHandler(UpdateAccountCommand)
@singleton()
export class UpdateAccountCommandHandler implements ICommandHandler<UpdateAccountCommand, any> {
  public readonly logger = createLogger(UpdateAccountCommandHandler.name)
  constructor(
    @injectUserService()
    private readonly service: IUserService,
  ) {}

  async execute(command: UpdateAccountCommand): Promise<any> {
    await this.service.updateName(command.userId, command.username)
  }
}
