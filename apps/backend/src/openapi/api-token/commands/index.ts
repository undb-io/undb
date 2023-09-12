import { NestCreateApiTokenCommandHandler } from './create-api-token.command-handler.js'
import { NestDeleteApiTokenCommandHandler } from './delete-api-token.command-handler.js'

export const commandHandlers = [NestCreateApiTokenCommandHandler, NestDeleteApiTokenCommandHandler]
