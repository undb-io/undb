import type { ICommandHandler } from '@undb/domain'
import type { IInvitationRepository } from '@undb/integrations'
import { InvitationFactory, WithInvitationEmail } from '@undb/integrations'
import type { InviteCommand } from './invite.command.js'

type IInviteCommandHandler = ICommandHandler<InviteCommand, void>

export class InviteCommandHandler implements IInviteCommandHandler {
  constructor(protected readonly repo: IInvitationRepository) {}

  async execute(command: InviteCommand): Promise<void> {
    const existing = await this.repo.findOne(WithInvitationEmail.fromString(command.email))
    if (existing.isSome()) {
      const spec = existing.unwrap().reinvite(command.role)

      await this.repo.updateOneById(existing.unwrap().id.value, spec)
    } else {
      const invitation = InvitationFactory.invite(command.email, command.role)

      await this.repo.insert(invitation)
    }
  }
}
