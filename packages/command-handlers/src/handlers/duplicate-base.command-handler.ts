import { injectBaseRepository, type IBaseRepository } from "@undb/base"
import { DuplicateBaseCommand } from "@undb/commands"
import { mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(DuplicateBaseCommand)
@singleton()
export class DuplicateBaseCommandHandler implements ICommandHandler<DuplicateBaseCommand, any> {
  private readonly logger = createLogger(DuplicateBaseCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableService()
    private readonly tableService: ITableService,
  ) {}

  async execute(command: DuplicateBaseCommand): Promise<any> {
    const base = (await this.baseRepository.findOneById(command.id)).expect("Base not found")

    const spaceId = mustGetCurrentSpaceId()
    const duplicatedBase = await this.tableService.duplicateBase(base, spaceId, spaceId, command)

    return duplicatedBase.id.value
  }
}
