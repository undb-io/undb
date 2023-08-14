import { NestAcceptInvitationCommandHandler } from './accept-invitation.command-handler.js'
import { NestCancelInvitationCommandHandler } from './cancel-invitation.command-handler.js'
import { NestInviteCommandHandler } from './invite.command-handler.js'
import { NestReInviteCommandHandler } from './reinvite.command-handler.js'
import { NestSendInvitationMailCommandHandler } from './send-invitation-mail.command-handler.js'

export const commands = [
  NestInviteCommandHandler,
  NestReInviteCommandHandler,
  NestCancelInvitationCommandHandler,
  NestSendInvitationMailCommandHandler,
  NestAcceptInvitationCommandHandler,
]
