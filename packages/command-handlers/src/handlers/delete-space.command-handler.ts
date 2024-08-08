import { DeleteSpaceCommand } from "@undb/commands"
import { getCurrentUserId, mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { injectSpaceRepository, WithSpaceUserId, type ISpaceRepository } from "@undb/space"

@commandHandler(DeleteSpaceCommand)
@singleton()
export class DeleteSpaceCommandHandler implements ICommandHandler<DeleteSpaceCommand, any> {
  constructor(
    @injectSpaceRepository()
    private readonly repository: ISpaceRepository,
  ) {}

  async execute(command: DeleteSpaceCommand): Promise<any> {
    const spaces = await this.repository.find(new WithSpaceUserId(getCurrentUserId()))
    if (spaces.length === 1) {
      throw new Error("Cannot delete the last space")
    }

    const spaceId = mustGetCurrentSpaceId()
    const space = (await this.repository.findOneById(spaceId)).expect("Space not found")
    if (space.isPersonal) {
      throw new Error("Cannot delete personal space")
    }

    await this.repository.deleteOneById(space.id.value)

    return space.id.value
  }
}
