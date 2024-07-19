import { injectWorkspaceMemberService, type IWorkspaceMemberService } from "@undb/authz"
import { InviteCommand } from "@undb/commands"
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
    await this.service.invite(command)
  }
}
