import { injectSpaceMemberService, type ISpaceMemberService } from "@undb/authz"
import { AcceptInvitationCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(AcceptInvitationCommand)
@singleton()
export class AcceptInvitationCommandHandler implements ICommandHandler<AcceptInvitationCommand, any> {
  public readonly logger = createLogger(AcceptInvitationCommandHandler.name)
  constructor(
    @injectSpaceMemberService()
    private readonly service: ISpaceMemberService,
  ) {}

  async execute(command: AcceptInvitationCommand): Promise<any> {
    await this.service.acceptinvitation(command.id)
  }
}
