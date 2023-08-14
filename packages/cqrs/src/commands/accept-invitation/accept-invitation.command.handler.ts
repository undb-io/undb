import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import type { AcceptInvitationCommand } from './accept-invitation.command.js'

type IAcceptInvitationCommandHandler = ICommandHandler<AcceptInvitationCommand, void>

export class AcceptInvitationCommandHandler implements IAcceptInvitationCommandHandler {
  constructor(protected readonly repo: IInvitationRepository) {}

  async execute(command: AcceptInvitationCommand): Promise<void> {
    const invitation = (await this.repo.findOneById(command.id)).unwrap()

    const spec = invitation.accept()

    if (spec.isSome()) {
      await this.repo.updateOneById(invitation.id.value, spec.unwrap())
    }
  }
}
