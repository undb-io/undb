import { CommandHandler } from '@nestjs/cqrs'
import { SendInvitationMailCommand, SendInvitationMailCommandHandler } from '@undb/cqrs'
import { NestInvitationService } from '../invitation.service.js'

@CommandHandler(SendInvitationMailCommand)
export class NestSendInvitationMailCommandHandler extends SendInvitationMailCommandHandler {
  constructor(protected readonly service: NestInvitationService) {
    super(service)
  }
}
