import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { InviteCommand } from "@undb/commands"
import { getCurrentUser, mustGetCurrentSpaceId } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(InviteCommand)
@singleton()
export class InviteCommandHandler implements ICommandHandler<InviteCommand, any> {
  public readonly logger = createLogger(InviteCommandHandler.name)
  constructor(
    @injectSpaceMemberService()
    private readonly service: ISpaceMemberService,
  ) {}

  async execute(command: InviteCommand): Promise<any> {
    const user = getCurrentUser()
    const spaceId = mustGetCurrentSpaceId()

    await this.service.invite({ ...command, inviterId: user.userId!, spaceId }, user.username!)
  }
}
