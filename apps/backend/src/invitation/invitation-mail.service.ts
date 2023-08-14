import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { getInvitationURL, type IInvitationMailService, type Invitation } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'

@Injectable()
export class InvitationMailService implements IInvitationMailService {
  constructor(
    protected readonly mailService: MailerService,
    @InjectPinoLogger(InvitationMailService.name)
    private readonly logger: PinoLogger,
  ) {}
  async send(invitation: Invitation): Promise<void> {
    try {
      await this.mailService.sendMail({
        to: invitation.email.unpack(),
        subject: 'Invitation',
        template: 'invite',
        context: {
          email: invitation.email.unpack(),
          url: getInvitationURL('http://localhost:3000', invitation.id.value),
        },
      })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
