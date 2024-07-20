import { type IInvitationRepository, injectInvitationRepository } from "@undb/authz"
import { DeleteInvitationCommand } from "@undb/commands"
import { commandHandler } from "@undb/cqrs"
import { singleton } from "@undb/di"
import type { ICommandHandler } from "@undb/domain"
import { createLogger } from "@undb/logger"

@commandHandler(DeleteInvitationCommand)
@singleton()
export class DeleteInvitationCommandHandler implements ICommandHandler<DeleteInvitationCommand, any> {
  public readonly logger = createLogger(DeleteInvitationCommandHandler.name)
  constructor(
    @injectInvitationRepository()
    private readonly repo: IInvitationRepository,
  ) {}

  async execute(command: DeleteInvitationCommand): Promise<any> {
    await this.repo.deleteOneById(command.id)
  }
}
