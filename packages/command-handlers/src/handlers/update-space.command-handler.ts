import { UpdateSpaceCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { injectSpaceRepository, type ISpaceRepository } from "@undb/space"

@commandHandler(UpdateSpaceCommand)
@singleton()
export class UpdateSpaceCommandHandler implements ICommandHandler<UpdateSpaceCommand, any> {
  constructor(
    @injectSpaceRepository()
    private readonly repository: ISpaceRepository,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: UpdateSpaceCommand): Promise<any> {
    const spaceId = this.context.mustGetCurrentSpaceId()
    const space = (await this.repository.findOneById(spaceId)).expect("Space not found")

    const spec = space.$update(command)

    if (spec.isSome()) {
      await this.repository.updateOneById(space, spec.unwrap())
    }

    return space.id.value
  }
}
