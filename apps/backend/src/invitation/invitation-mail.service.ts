import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import type { IInvitationMailService, Invitation } from '@undb/integrations'

@Injectable()
export class InvitationMailService implements IInvitationMailService {
  constructor(protected readonly mailService: MailerService) {}
  async send(invitation: Invitation): Promise<void> {
    console.log(invitation)
    console.log(this.mailService)
  }
}
