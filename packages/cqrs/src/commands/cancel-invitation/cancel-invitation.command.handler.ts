import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import type { CancelInvitationCommand } from './cancel-invitation.command.js'

type ICancelInvitationCommandHandler = ICommandHandler<CancelInvitationCommand, void>

export class CancelInvitationCommandHandler implements ICancelInvitationCommandHandler {
  constructor(protected readonly repo: IInvitationRepository) {}

  async execute(command: CancelInvitationCommand): Promise<void> {
    const invitation = (await this.repo.findOneById(command.id)).unwrap()

    const spec = invitation.cancel()
    if (spec.isSome()) {
      await this.repo.updateOneById(invitation.id.value, spec.unwrap())
    }
  }
}
