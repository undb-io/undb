import { CommandHandler } from '@nestjs/cqrs'
import { AcceptInvitationCommand, AcceptInvitationCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(AcceptInvitationCommand)
export class NestAcceptInvitationCommandHandler extends AcceptInvitationCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
  ) {
    super(repo)
  }
}
