import { Injectable } from '@nestjs/common'
import { getInvitationURL, type IInvitationMailService, type Invitation } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { type IMailService } from '../mail/mail.interface.js'
import { InjectMailService } from '../mail/providers.js'

@Injectable()
export class InvitationMailService implements IInvitationMailService {
  constructor(
    @InjectMailService()
    protected readonly mailService: IMailService,
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
