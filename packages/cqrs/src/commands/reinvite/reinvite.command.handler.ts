import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import type { ReInviteCommand } from './reinvite.command.js'

type IReInviteCommandHandler = ICommandHandler<ReInviteCommand, void>

export class ReInviteCommandHandler implements IReInviteCommandHandler {
  constructor(protected readonly repo: IInvitationRepository) {}

  async execute(command: ReInviteCommand): Promise<void> {
    const invitation = (await this.repo.findOneById(command.id)).unwrap()
    const spec = invitation.reinvite(command.role)

    await this.repo.updateOneById(invitation.id.value, spec)
  }
}
