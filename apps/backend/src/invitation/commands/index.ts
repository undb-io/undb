import { NestInviteCommandHandler } from './invite.command-handler.js'
import { NestReInviteCommandHandler } from './reinvite.command-handler.js'

export const commands = [NestInviteCommandHandler, NestReInviteCommandHandler]
