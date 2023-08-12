import { CommandHandler } from '@nestjs/cqrs'
import { CancelInvitationCommand, CancelInvitationCommandHandler } from '@undb/cqrs'
import { type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from '../adapters/invitation-sqlite.repository.js'

@CommandHandler(CancelInvitationCommand)
export class NestCancelInvitationCommandHandler extends CancelInvitationCommandHandler {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
  ) {
    super(repo)
  }
}
