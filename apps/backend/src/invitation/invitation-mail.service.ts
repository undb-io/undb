import { Injectable } from '@nestjs/common'
import { getInvitationURL, type IInvitationMailService, type Invitation } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { BaseConfigService } from '../configs/base-config.service.js'
import { type IMailService } from '../mail/mail.interface.js'
import { InjectMailService } from '../mail/providers.js'

@Injectable()
export class InvitationMailService implements IInvitationMailService {
  constructor(
    @InjectMailService()
    protected readonly mailService: IMailService,
    @InjectPinoLogger(InvitationMailService.name)
    private readonly logger: PinoLogger,
    private readonly config: BaseConfigService,
  ) {}
  async send(invitation: Invitation): Promise<void> {
    try {
      const host = this.config.host
      await this.mailService.sendMail({
        to: invitation.email.unpack(),
        subject: 'Invitation',
        template: 'invite',
        context: {
          email: invitation.email.unpack(),
          url: getInvitationURL(host, invitation.id.value),
        },
      })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
