import { injectBaseRepository, type IBaseRepository } from "@undb/base"
import { DuplicateBaseCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(DuplicateBaseCommand)
@singleton()
export class DuplicateBaseCommandHandler implements ICommandHandler<DuplicateBaseCommand, any> {
  private readonly logger = createLogger(DuplicateBaseCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly repository: IBaseRepository,
  ) {}

  async execute(command: DuplicateBaseCommand): Promise<any> {
    const base = (await this.repository.findOneById(command.id)).expect("Base not found")

    throw new Error("Not implemented")
  }
}
