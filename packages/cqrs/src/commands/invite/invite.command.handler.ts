import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import { InvitationFactory } from '@undb/integrations'
import type { InviteCommand } from './invite.command.js'

type IInviteCommandHandler = ICommandHandler<InviteCommand, void>

export class InviteCommandHandler implements IInviteCommandHandler {
  constructor(protected readonly repo: IInvitationRepository) {}

  async execute(command: InviteCommand): Promise<void> {
    const invitation = InvitationFactory.invite()

    await this.repo.insert(invitation)
  }
}
