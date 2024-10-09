import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { CreateSpaceCommand } from "@undb/commands"
import { injectContext, type IContext } from "@undb/context"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import { type ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"
import { injectSpaceRepository, SpaceFactory, type ISpaceRepository } from "@undb/space"

@commandHandler(CreateSpaceCommand)
@singleton()
export class CreateSpaceCommandHandler implements ICommandHandler<CreateSpaceCommand, any> {
  private readonly logger = createLogger(CreateSpaceCommandHandler.name)

  constructor(
    @injectSpaceRepository()
    private readonly repository: ISpaceRepository,
    @injectSpaceMemberService()
    private readonly spaceMemberService: ISpaceMemberService,
    @injectContext()
    private readonly context: IContext,
  ) {}

  async execute(command: CreateSpaceCommand): Promise<any> {
    this.logger.debug(command)

    const space = SpaceFactory.create(command)

    await this.repository.insert(space)
    const userId = this.context.mustGetCurrentUserId()
    await this.spaceMemberService.createMember(userId, space.id.value, "owner")

    return space.id.value
  }
}
