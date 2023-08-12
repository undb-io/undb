import { Injectable } from '@nestjs/common'
import type { IInvitationMailService, Invitation } from '@undb/integrations'
import { InvitationService, type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from './adapters/invitation-sqlite.repository.js'

class ____FakeMailService implements IInvitationMailService {
  send(invitation: Invitation): Promise<void> {
    throw new Error('Method not implemented.')
  }
}

@Injectable()
export class NestInvitationService extends InvitationService {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
  ) {
    super(repo, new ____FakeMailService())
  }
}
