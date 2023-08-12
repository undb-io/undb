import type { ICommandHandler } from '@undb/domain'
import type { IInvitationService } from '@undb/integrations'
import type { SendInvitationMailCommand } from './send-invitation-mail.command.js'

type ISendInvitationMailCommandHandler = ICommandHandler<SendInvitationMailCommand, void>

export class SendInvitationMailCommandHandler implements ISendInvitationMailCommandHandler {
  constructor(protected readonly service: IInvitationService) {}

  async execute(command: SendInvitationMailCommand): Promise<void> {
    await this.service.sendInvitationMail(command.id)
  }
}
