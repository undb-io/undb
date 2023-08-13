import { Injectable } from '@nestjs/common'
import { InvitationService, type IInvitationRepository } from '@undb/integrations'
import { InjectInvitationRepository } from './adapters/invitation-sqlite.repository.js'
import { InvitationMailService } from './invitation-mail.service.js'

@Injectable()
export class NestInvitationService extends InvitationService {
  constructor(
    @InjectInvitationRepository()
    protected readonly repo: IInvitationRepository,
    protected readonly mail: InvitationMailService,
  ) {
    super(repo, mail)
  }
}
