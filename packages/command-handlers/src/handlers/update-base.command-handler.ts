import {
  BaseName,
  BaseNameShouldBeUnique,
  injectBaseRepository,
  WithBaseName,
  WithBaseSpaceId,
  type IBaseRepository,
} from "@undb/base"
import { UpdateBaseCommand } from "@undb/commands"
import { mustGetCurrentSpaceId } from "@undb/context/server"
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
  ) {}

  async execute(command: UpdateBaseCommand): Promise<any> {
    this.logger.debug(command)

    const base = (await this.repository.findOneById(command.id)).unwrap()

    if (command.name) {
      const nameSpec = new WithBaseName(BaseName.from(command.name)).and(new WithBaseSpaceId(mustGetCurrentSpaceId()))
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
