import { BaseId, injectBaseRepository, WithBaseId, WithBaseSpaceId, type IBaseRepository } from "@undb/base"
import { CreateFromTemplateCommand } from "@undb/commands"
import { mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTableService, type ITableService } from "@undb/table"

@commandHandler(CreateFromTemplateCommand)
@singleton()
export class CreateFromTemplateCommandHandler implements ICommandHandler<CreateFromTemplateCommand, any> {
  private readonly logger = createLogger(CreateFromTemplateCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly baseRepository: IBaseRepository,
    @injectTableService()
    private readonly tableService: ITableService,
  ) {}

  async execute(command: CreateFromTemplateCommand): Promise<any> {
    const spec = new WithBaseId(new BaseId(command.baseId)).and(new WithBaseSpaceId(command.spaceId))
    const base = (await this.baseRepository.findOne(spec)).expect("Base not found")

    const targetSpaceId = command.targetSpaceId ?? mustGetCurrentSpaceId()
    const duplicatedBase = await this.tableService.duplicateBase(base, targetSpaceId, {
      id: command.baseId,
      name: command.name,
      includeData: command.includeData,
    })

    return duplicatedBase.id.value
  }
}
