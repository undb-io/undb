import { NestCreateBaseCommandHandler } from './create-base.command-handler.js'
import { NestMoveToBaseCommandHandler } from './move-to-base.command-handler.js'

export const commands = [NestCreateBaseCommandHandler, NestMoveToBaseCommandHandler]
