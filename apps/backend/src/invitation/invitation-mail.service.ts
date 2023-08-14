import { Injectable } from '@nestjs/common'
import { type IInvitationMailService, type Invitation } from '@undb/integrations'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { joinURL } from 'ufo'
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
      const url = joinURL(host, 'api', 'invitations', invitation.id.value, 'accept')
      await this.mailService.sendMail({
        to: invitation.email.unpack(),
        subject: 'Invitation',
        template: 'invite',
        context: {
          email: invitation.email.unpack(),
          url,
          invitedBy: invitation.invitedByProfile.profile.username,
        },
      })
    } catch (error) {
      this.logger.error(error)
    }
  }
}
