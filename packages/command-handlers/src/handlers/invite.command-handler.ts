import { injectWorkspaceMemberService, type IWorkspaceMemberService } from "@undb/authz"
import { InviteCommand } from "@undb/commands"
import { getCurrentUser } from "@undb/context/server"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(InviteCommand)
@singleton()
export class InviteCommandHandler implements ICommandHandler<InviteCommand, any> {
  public readonly logger = createLogger(InviteCommandHandler.name)
  constructor(
    @injectWorkspaceMemberService()
    private readonly service: IWorkspaceMemberService,
  ) {}

  async execute(command: InviteCommand): Promise<any> {
    const user = getCurrentUser()

    await this.service.invite({ ...command, inviterId: user.userId! }, user.username!)
  }
}
