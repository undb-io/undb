import {
  BaseFactory,
  BaseName,
  BaseNameShouldBeUnique,
  injectBaseRepository,
  WithBaseName,
  WithBaseSpaceId,
  type IBaseRepository,
} from "@undb/base"
import { CreateBaseCommand, type ICreateBaseCommandOutput } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { applyRules, type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(CreateBaseCommand)
@singleton()
export class CreateBaseCommandHandler implements ICommandHandler<CreateBaseCommand, ICreateBaseCommandOutput> {
  private readonly logger = createLogger(CreateBaseCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly repository: IBaseRepository,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: CreateBaseCommand): Promise<ICreateBaseCommandOutput> {
    this.logger.debug(command)

    const spaceId = this.context.mustGetCurrentSpaceId()
    const nameSpec = new WithBaseName(BaseName.from(command.name)).and(new WithBaseSpaceId(spaceId))
    const exists = (await this.repository.findOne(nameSpec)).into(null)

    applyRules(new BaseNameShouldBeUnique(!!exists))

    command.spaceId = spaceId
    const base = BaseFactory.create(command)

    await this.repository.insert(base)

    return base.id.value
  }
}
