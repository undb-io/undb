import { CreateFromTemplateCommand, type ICreateFromTemplateCommandOutput } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { injectTemplateService, type ITemplateService } from "@undb/template"

@commandHandler(CreateFromTemplateCommand)
@singleton()
export class CreateFromTemplateCommandHandler
  implements ICommandHandler<CreateFromTemplateCommand, ICreateFromTemplateCommandOutput>
{
  constructor(
    @injectTemplateService()
    private readonly templateService: ITemplateService,
  ) {}

  async execute(command: CreateFromTemplateCommand): Promise<ICreateFromTemplateCommandOutput> {
    // TODO: check if the user has access to the space
    const result = await this.templateService.createBase(command, command.spaceId)

    return { baseIds: result.map(({ base }) => base.id.value) }
  }
}
