import { BaseFactory, injectBaseRepository, type IBaseRepository } from "@undb/base"
import { CreateBaseCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(CreateBaseCommand)
@singleton()
export class CreateBaseCommandHandler implements ICommandHandler<CreateBaseCommand, any> {
  private readonly logger = createLogger(CreateBaseCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly repository: IBaseRepository,
  ) {}

  async execute(command: CreateBaseCommand): Promise<any> {
    this.logger.debug(command)

    const base = BaseFactory.create(command)

    await this.repository.insert(base)

    return base.id.value
  }
}
