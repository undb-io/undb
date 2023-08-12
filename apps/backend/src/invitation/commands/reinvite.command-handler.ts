import { CommandHandler } from '@nestjs/cqrs'
import { ReInviteCommand, ReInviteCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(ReInviteCommand)
export class NestReInviteCommandHandler extends ReInviteCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
  ) {
    super(repo)
  }
}
