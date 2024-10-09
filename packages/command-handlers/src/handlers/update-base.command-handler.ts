import {
  BaseId,
  BaseName,
  BaseNameShouldBeUnique,
  injectBaseRepository,
  WithBaseId,
  WithBaseName,
  WithBaseSpaceId,
  type IBaseRepository,
} from "@undb/base"
import { UpdateBaseCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { applyRules, type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(UpdateBaseCommand)
@singleton()
export class UpdateBaseCommandHandler implements ICommandHandler<UpdateBaseCommand, any> {
  private readonly logger = createLogger(UpdateBaseCommandHandler.name)

  constructor(
    @injectBaseRepository()
    private readonly repository: IBaseRepository,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: UpdateBaseCommand): Promise<any> {
    this.logger.debug(command)

    const base = (await this.repository.findOneById(command.id)).unwrap()

    const spaceId = this.context.mustGetCurrentSpaceId()
    if (command.name) {
      const nameSpec = new WithBaseName(BaseName.from(command.name))
        .and(new WithBaseSpaceId(spaceId))
        .and(new WithBaseId(new BaseId(command.id)).not())
      const exists = (await this.repository.findOne(nameSpec)).into(null)

      applyRules(new BaseNameShouldBeUnique(!!exists))
    }

    const spec = base.$update(command)

    if (spec.isSome()) {
      await this.repository.updateOneById(base, spec.unwrap())
    }

    return base.id.value
  }
}
