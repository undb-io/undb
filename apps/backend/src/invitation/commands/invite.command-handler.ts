import { CommandHandler } from '@nestjs/cqrs'
import { InviteCommand, InviteCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(InviteCommand)
export class NestInviteCommandHandler extends InviteCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
  ) {
    super(repo)
  }
}
