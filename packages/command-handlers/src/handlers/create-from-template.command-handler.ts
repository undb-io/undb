import { CreateFromTemplateCommand, type ICreateFromTemplateCommandOutput } from "@undb/commands"
import { mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectTemplateService, type ITemplateService } from "@undb/template"

@commandHandler(CreateFromTemplateCommand)
@singleton()
export class CreateFromTemplateCommandHandler
  implements ICommandHandler<CreateFromTemplateCommand, ICreateFromTemplateCommandOutput>
{
  private readonly logger = createLogger(CreateFromTemplateCommandHandler.name)

  constructor(
    @injectTemplateService()
    private readonly templateService: ITemplateService,
  ) {}

  async execute(command: CreateFromTemplateCommand): Promise<ICreateFromTemplateCommandOutput> {
    const spaceId = mustGetCurrentSpaceId()
    const result = await this.templateService.createBase(command.id, spaceId)

    return { baseIds: result.map(({ base }) => base.id.value) }
  }
}
